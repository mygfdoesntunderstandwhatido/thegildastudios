/** Contact delivery is deliberately independent of Astro so it can be tested without sending mail. */
export interface ContactMessage {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
}

export interface ContactEnvironment {
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_BACKUP_EMAIL?: string;
  CONTACT_EMAIL?: { send(message: ContactMessage): Promise<unknown> };
}

export interface ContactOptions {
  services: Record<string, { branch: string; name: string }>;
  branches: readonly string[];
  failureMessage: string;
  subject: string;
  labels: Record<string, string>;
  fetch?: typeof fetch;
}

const EMAIL = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const MAX_BYTES = 32_768;

export async function handleContact(
  request: Request,
  env: ContactEnvironment,
  options: ContactOptions,
): Promise<Response> {
  const enhanced = request.headers.get('accept')?.includes('application/json');
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const fail = (status: number) =>
    enhanced
      ? Response.json({ accepted: false }, { status, headers })
      : new Response(options.failureMessage, {
          status,
          headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
        });
  const success = (accepted: boolean) =>
    enhanced
      ? Response.json({ accepted }, { headers })
      : new Response(null, { status: 303, headers: { ...headers, Location: '/contact/thanks/' } });

  if (request.method !== 'POST') return fail(405);
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return fail(403);
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/x-www-form-urlencoded'
  )
    return fail(415);
  // Bound the actual stream, not just the caller-controlled Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return fail(400);
  let size = 0;
  let raw = '';
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return fail(413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return fail(400);
  }
  const data = new URLSearchParams(raw);
  if (data.get('bot-field')?.trim()) return success(false);
  const fields = [
    'name',
    'email',
    'business',
    'phone',
    'preferred',
    'message',
    'service',
    'branch',
  ] as const;
  if ([...fields, 'cf-turnstile-response'].some((key) => data.getAll(key).length > 1))
    return fail(400);
  const values = Object.fromEntries(fields.map((key) => [key, (data.get(key) ?? '').trim()]));
  const needs = [...new Set(data.getAll('needs'))];
  if (
    !values.name ||
    !EMAIL.test(values.email) ||
    !values.message ||
    !['email', 'call', 'meeting'].includes(values.preferred) ||
    (values.preferred === 'call' && !values.phone) ||
    fields.some((key) => values[key].length > (key === 'message' ? 10_000 : 254)) ||
    needs.some((need) => ![...options.branches, 'unsure'].includes(need)) ||
    (needs.includes('unsure') && needs.length > 1)
  )
    return fail(400);
  if (values.service && !Object.hasOwn(options.services, values.service)) return fail(400);
  const selected = options.branches.filter((branch) => needs.includes(branch));
  if (values.branch && values.branch !== selected.join(',')) return fail(400);
  if (values.service && !selected.includes(options.services[values.service].branch))
    return fail(400);
  // Native forms do not run syncBranches; derive this from validated checkboxes.
  values.branch = selected.join(',');
  values.needs = needs.join(',');
  const token = data.get('cf-turnstile-response') ?? '';
  if (!token || token.length > 2048) return fail(403);
  if (
    !env.TURNSTILE_SECRET_KEY ||
    !env.CONTACT_EMAIL ||
    !env.CONTACT_BACKUP_EMAIL ||
    !EMAIL.test(env.CONTACT_BACKUP_EMAIL)
  )
    return fail(503);
  try {
    const verification = await (options.fetch ?? fetch)(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!verification.ok) return fail(503);
    const result = (await verification.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    if (result.success !== true || result.hostname !== url.hostname || result.action !== 'contact')
      return fail(403);
    await env.CONTACT_EMAIL.send({
      from: 'website@thegildastudios.com',
      to: [...new Set(['hello@thegildastudios.com', env.CONTACT_BACKUP_EMAIL])],
      replyTo: values.email,
      subject: options.subject,
      text: [...fields, 'needs']
        .map((key) => `${options.labels[key]}: ${values[key]}`)
        .join('\n\n'),
    });
    return success(true);
  } catch {
    // Neither provider errors nor form values belong in Worker logs/responses.
    return fail(503);
  }
}
