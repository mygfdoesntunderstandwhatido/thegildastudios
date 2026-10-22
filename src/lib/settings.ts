import { getEntry } from 'astro:content';

/** The site settings singleton: src/content/settings/site.json. */
export async function getSettings() {
  const site = await getEntry('settings', 'site');
  if (!site) throw new Error('Missing the settings singleton: src/content/settings/site.json');
  return site.data;
}
