import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { env } from 'cloudflare:workers';
import { BRANCH_ORDER } from '../../lib/branches';
import { handleContact, type ContactEnvironment } from '../../lib/server/contact';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const page = await getEntry('contact', 'page');
  if (!page) return new Response(null, { status: 503 });
  const { form } = page.data;
  const services = Object.fromEntries(
    (await getCollection('services')).map(({ data }) => [data.number, data]),
  );
  return handleContact(request, env as ContactEnvironment, {
    services,
    branches: BRANCH_ORDER,
    failureMessage: form.submissionError,
    subject: form.delivery.subject,
    labels: {
      ...Object.fromEntries(Object.entries(form.fields).map(([key, field]) => [key, field.label])),
      needs: form.needs.legend,
      preferred: form.preferred.legend,
      service: form.delivery.service,
      branch: form.delivery.branch,
    },
  });
};
