import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleContact, type ContactMessage } from '../src/lib/server/contact.ts';

function setup() {
  const messages: ContactMessage[] = [];
  let verifications = 0;
  const env = { TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 're_test' };
  const requests: { authorization: string | null; body: Record<string, unknown> }[] = [];
  let delivery: () => Promise<Response> = async () => Response.json({ id: 'email-id' });
  const options = {
    services: { '01.2': { branch: 'plan', name: 'Event' } },
    branches: ['plan', 'build', 'grow'],
    failureMessage: 'Please try again.',
    subject: 'Website enquiry',
    labels: Object.fromEntries(
      [
        'name',
        'email',
        'business',
        'phone',
        'preferred',
        'message',
        'service',
        'branch',
        'needs',
      ].map((key) => [key, key]),
    ),
    to: 'hello@studio.example',
    verify: async () =>
      Response.json({ success: true, hostname: 'studio.example', action: 'contact' }),
    fetch: (async (input: string | URL | Request, init?: RequestInit) => {
      if (String(input) === 'https://api.resend.com/emails') {
        const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
        const response = await delivery();
        requests.push({ authorization: new Headers(init?.headers).get('authorization'), body });
        if (response.ok)
          messages.push({
            from: body.from as string,
            to: body.to as string[],
            replyTo: body.reply_to as string,
            subject: body.subject as string,
            text: body.text as string,
          });
        return response;
      }
      verifications++;
      return options.verify();
    }) as typeof fetch,
  };
  const data = new URLSearchParams({
    name: 'Zoë',
    email: 'zoe@example.com',
    message: 'A & B + café',
    preferred: 'email',
    service: '01.2',
    branch: 'plan,build',
    'cf-turnstile-response': 'token',
  });
  data.append('needs', 'plan');
  data.append('needs', 'build');
  const send = (enhanced = true, body = data.toString()) =>
    handleContact(
      new Request('https://studio.example/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: enhanced ? 'application/json' : 'text/html',
        },
        body,
      }),
      env,
      options,
    );
  return {
    env,
    options,
    data,
    send,
    messages,
    requests,
    verifications: () => verifications,
    failDelivery: (response: () => Promise<Response>) => (delivery = response),
  };
}

test('validated enquiry sends labelled Unicode fields to the studio inbox through Resend, with Reply-To', async () => {
  const s = setup();
  const response = await s.send();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { accepted: true });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(s.messages.length, 1);
  assert.deepEqual(s.messages[0].to, ['hello@studio.example']);
  assert.equal(s.requests[0].authorization, 'Bearer re_test');
  assert.match(s.messages[0].from, /<website@thegildastudios\.com>$/);
  assert.equal(s.messages[0].replyTo, 'zoe@example.com');
  assert.match(s.messages[0].text, /message: A & B \+ café/);
  assert.match(s.messages[0].text, /service: 01.2/);
  assert.match(s.messages[0].text, /branch: plan,build/);
  assert.match(s.messages[0].text, /needs: plan,build/);
  assert.doesNotMatch(s.messages[0].text, /token|test-secret/);
});

test('native POST with a valid token redirects with 303 and derives branches', async () => {
  const s = setup();
  s.data.set('branch', '');
  const response = await s.send(false);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/contact/thanks/');
  assert.match(s.messages[0].text, /branch: plan,build/);
});

test('honeypot silently discards without verification or email or conversion', async () => {
  const s = setup();
  s.data.set('bot-field', 'spam');
  assert.deepEqual(await (await s.send()).json(), { accepted: false });
  assert.equal(s.verifications(), 0);
  assert.equal(s.messages.length, 0);
});

for (const [key, value] of [
  ['name', ' '],
  ['email', 'bad'],
  ['email', 'a@b.com\r\nBcc: evil@example.com'],
  ['message', ''],
  ['preferred', 'invalid'],
  ['service', '__proto__'],
  ['service', '99.9'],
  ['branch', 'grow'],
  ['cf-turnstile-response', ''],
]) {
  test(`rejects invalid ${key}: ${JSON.stringify(value)}`, async () => {
    const s = setup();
    s.data.set(key, value);
    assert.ok((await s.send()).status >= 400);
    assert.equal(s.messages.length, 0);
  });
}

test('Call requires a phone, needs must be known, fields cannot be duplicated', async () => {
  for (const mutate of [
    (data: URLSearchParams) => data.set('preferred', 'call'),
    (data: URLSearchParams) => data.append('needs', 'unknown'),
    (data: URLSearchParams) => data.append('needs', 'unsure'),
    (data: URLSearchParams) => data.append('email', 'other@example.com'),
  ]) {
    const s = setup();
    mutate(s.data);
    assert.equal((await s.send()).status, 400);
    assert.equal(s.messages.length, 0);
  }
});

for (const result of [
  { success: false },
  { success: true, hostname: 'evil.example', action: 'contact' },
  { success: true, hostname: 'studio.example', action: 'login' },
]) {
  test(`rejects unverified challenge ${JSON.stringify(result)}`, async () => {
    const s = setup();
    s.options.verify = async () => Response.json(result);
    assert.equal((await s.send()).status, 403);
    assert.equal(s.messages.length, 0);
  });
}

test('missing configuration, provider errors and malformed responses fail closed without leaking data', async () => {
  for (const mode of ['config', 'verification', 'json', 'delivery', 'network']) {
    const s = setup();
    if (mode === 'config') s.env.RESEND_API_KEY = '';
    if (mode === 'verification')
      s.options.verify = async () => {
        throw new Error('secret');
      };
    if (mode === 'json') s.options.verify = async () => new Response('invalid');
    if (mode === 'delivery')
      s.failDelivery(async () => Response.json({ message: 'private' }, { status: 422 }));
    if (mode === 'network')
      s.failDelivery(async () => {
        throw new Error('private message');
      });
    const response = await s.send();
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { accepted: false });
    assert.equal(s.messages.length, 0);
  }
});

test('oversize requests are rejected without trusting Content-Length', async () => {
  const s = setup();
  assert.equal((await s.send(true, 'x'.repeat(32_769))).status, 413);
  assert.equal(s.messages.length, 0);
});
