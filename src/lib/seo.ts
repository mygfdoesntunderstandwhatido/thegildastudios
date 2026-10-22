import { getEntry } from 'astro:content';
import { getSettings } from './settings';
import { getCaseStudies } from './case-studies';
import { pagePath } from './seo-policy.mjs';

export interface SeoPage {
  path: string;
  title?: string;
  description?: string;
  headline: string;
  sector?: string;
}

/** The same published content feeds page metadata and the static social cards. */
export async function getSeoPages(): Promise<SeoPage[]> {
  const [home, about, services, projects, contact, notFound, thanks, studies] = await Promise.all([
    getEntry('homepage', 'home'),
    getEntry('about', 'page'),
    getEntry('servicesPage', 'page'),
    getEntry('projects', 'page'),
    getEntry('contact', 'page'),
    getEntry('systemPages', 'not-found'),
    getEntry('systemPages', 'contact-thanks'),
    getCaseStudies(),
  ]);
  if (!home || !about || !services || !projects || !contact || !notFound || !thanks) {
    throw new Error('Missing a page singleton needed for SEO.');
  }
  return [
    { path: '/', ...home.data.meta, headline: home.data.hero.title },
    { path: '/about/', ...about.data.meta, headline: about.data.opening.headline },
    { path: '/services/', ...services.data.meta, headline: services.data.opening.headline },
    { path: '/projects/', ...projects.data.meta, headline: projects.data.headline },
    { path: '/contact/', ...contact.data.meta, headline: contact.data.headline },
    { path: '/404/', ...notFound.data.meta, headline: notFound.data.headline },
    { path: '/contact/thanks/', ...thanks.data.meta, headline: thanks.data.headline },
    ...studies.map(({ id, data }) => ({
      path: `/projects/${id}/`,
      title: data.meta.title ?? data.name,
      description: data.meta.description ?? data.short,
      headline: data.name,
      sector: data.sector,
    })),
  ];
}

export function ogPath(path: string) {
  if (/^\/dev(?:\/|$)/.test(path)) path = '/';
  return `/og/${pagePath(path).replace(/^\/|\/$/g, '') || 'home'}.png`;
}

export async function pageMetadata(path: string, title?: string, description?: string) {
  const { seo, brand } = await getSettings();
  const pageTitle = title?.trim() || (path === '/' ? seo.homeTitle : seo.defaultTitle);
  const fullTitle =
    path === '/' || pageTitle === brand.name || pageTitle.endsWith(` · ${brand.name}`)
      ? pageTitle
      : `${pageTitle} · ${brand.name}`;
  return {
    title: fullTitle,
    description: description?.trim() || seo.defaultDescription,
    canonical: new URL(pagePath(path), seo.siteUrl).href,
    image: new URL(ogPath(path), seo.siteUrl).href,
  };
}
