// The Keystatic admin at /keystatic. Every collection and singleton here
// mirrors a schema in src/content/schemas/: same files, same fields, and the
// same required fields, so the admin blocks what the Astro build would reject.
// Branch colours, numbers and order stay in src/lib/branches.ts.
import { collection, config, fields, singleton } from '@keystatic/core';
import { createElement, Fragment } from 'react';
import { branches, orderBranches, type BranchKey } from './src/lib/branches';

// Local mode in development writes straight to this checkout. The deployed
// admin commits to GitHub, so editors can work on a branch first. Run
// `PUBLIC_KEYSTATIC_STORAGE=github npm run dev` to use GitHub mode locally,
// for example to create the GitHub App (see docs/editing.md).
const github = !import.meta.env.DEV || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github';
const storage = github
  ? ({
      kind: 'github',
      repo: { owner: 'mygfdoesntunderstandwhatido', name: 'thegildastudios' },
      // Every content branch gets a Cloudflare Workers preview.
      branchPrefix: 'content-',
    } as const)
  : ({ kind: 'local' } as const);

/**
 * The page on the preview of the branch being edited, so editors see their
 * saved changes before they publish. Workers serves each branch's preview at
 * <branch>-thegildastudios.<subdomain>.workers.dev, with the branch name in
 * lower case. The account's workers.dev subdomain is the build variable
 * PUBLIC_WORKERS_SUBDOMAIN; without it, the admin shows no preview link.
 */
const subdomain = import.meta.env.PUBLIC_WORKERS_SUBDOMAIN;
const preview = (path: string) => {
  if (!github) return path;
  return subdomain ? `https://{branch}-thegildastudios.${subdomain}.workers.dev${path}` : undefined;
};

// ---------------------------------------------------------------------------
// Field helpers

type TextOptions = { description?: string; multiline?: boolean };

/** Text that can't be left empty. */
const required = (label: string, { description, multiline }: TextOptions = {}) =>
  fields.text({ label, description, multiline, validation: { isRequired: true } });

/** Text that can be left empty. */
const optional = (label: string, { description, multiline }: TextOptions = {}) =>
  fields.text({ label, description, multiline });

/** A label that is shown in capitals. */
const caps = (label: string, description?: string) =>
  required(label, {
    description: description ?? 'Shown in capitals. Type it in capitals too.',
  });

const link = (label: string, description?: string) =>
  fields.object(
    {
      label: required('Link text'),
      href: required('Link address', {
        description:
          'A page on this site, such as /contact/ or /services/#plan, or a full address.',
      }),
    },
    { label, description },
  );

const list = (label: string, itemLabel: string, description?: string) =>
  fields.array(required(itemLabel), {
    label,
    description,
    itemLabel: (props) => props.value || itemLabel,
    validation: { length: { min: 1 } },
  });

const meta = () =>
  fields.object(
    {
      title: optional('Browser tab title', {
        description:
          'Leave empty for the default title in Site settings. The studio name is added automatically.',
      }),
      description: optional('Search result description', {
        multiline: true,
        description:
          'One or two sentences for search and social previews. Leave empty for the description in Site settings.',
      }),
    },
    { label: 'Page title and description' },
  );

const section = (label: string) => ({
  number: required('Section number', { description: 'Two digits, such as 02.' }),
  label: caps('Section label'),
  headline: required(`${label} headline`, {
    description: 'Sentence case, ending with a full stop.',
  }),
});

const cta = () =>
  fields.object(
    {
      eyebrow: required('Small line above the headline'),
      headline: required('Headline', { description: 'Sentence case, ending with a full stop.' }),
      body: required('Text', { multiline: true }),
      booking: link('Button'),
    },
    {
      label: 'Booking band',
      description: 'The dark band at the end of the page that asks people to get in touch.',
    },
  );

const branchOptions = orderBranches().map((branch) => ({
  label: `${branch.number} ${branch.name} (${branch.ingredient.toLowerCase()})`,
  value: branch.key,
}));

const branch = (label: string, description?: string) =>
  fields.select({ label, description, options: branchOptions, defaultValue: 'plan' });

/** Tick boxes for the branches. At least one has to be ticked. */
const branchList = (label: string, description?: string) => {
  const field = fields.multiselect({ label, description, options: branchOptions });
  const message = 'Choose at least one branch.';
  return {
    ...field,
    Input(props: Parameters<typeof field.Input>[0]) {
      const missing = props.forceValidation && props.value.length === 0;
      return createElement(
        Fragment,
        null,
        createElement(field.Input, props),
        missing &&
          createElement(
            'p',
            // Close to the admin's own field errors.
            {
              role: 'alert',
              style: {
                margin: 0,
                color: '#c4314b',
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                fontWeight: 500,
              },
            },
            message,
          ),
      );
    },
    validate(value: readonly BranchKey[]) {
      if (value.length === 0) throw new Error(message);
      return field.validate(value);
    },
  };
};

const order = (description: string) =>
  fields.integer({ label: 'Position', description, validation: { isRequired: true } });

const imageField = (label: string, folder: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `src/assets/content/${folder}`,
    publicPath: `../../assets/content/${folder}/`,
    validation: { isRequired: true },
  });

const picture = (label: string, description?: string) =>
  fields.object(
    {
      src: imageField('Image', 'case-studies'),
      alt: required('Alt text', {
        description:
          'What the image shows, for people who can’t see it. One plain sentence, such as “The CS Butcher counter with the new order screen”.',
      }),
    },
    { label, description },
  );

// ---------------------------------------------------------------------------
// Case study blocks

const group = fields.object({
  title: required('Group title'),
  items: list('Items', 'Item'),
});

const groups = fields.array(group, {
  label: 'Groups',
  itemLabel: (props) => props.fields.title.value || 'Group',
  validation: { length: { min: 1 } },
});

const blocks = fields.blocks(
  {
    paragraph: {
      label: 'Paragraph',
      itemLabel: (props) => props.fields.text.value || 'Paragraph',
      schema: fields.object({ text: required('Text', { multiline: true }) }),
    },
    list: {
      label: 'Numbered list',
      schema: fields.object({ items: list('Items', 'Item') }),
    },
    callout: {
      label: 'Callout',
      itemLabel: (props) => props.fields.text.value || 'Callout',
      schema: fields.object({ text: required('Text', { multiline: true }) }),
    },
    highlight: {
      label: 'Highlight panel',
      itemLabel: (props) => props.fields.text.value || 'Highlight panel',
      schema: fields.object({
        label: optional('Label', {
          description: 'Shown in capitals above the text. Leave empty to use THE RESULT.',
        }),
        text: required('Text', { multiline: true }),
      }),
    },
    quote: {
      label: 'Testimonial',
      schema: fields.object({
        testimonial: fields.relationship({
          label: 'Testimonial',
          collection: 'testimonials',
          description: 'The testimonial has to belong to this project.',
          validation: { isRequired: true },
        }),
      }),
    },
    groups: {
      label: 'Groups of items',
      schema: fields.object({ groups }),
    },
    pillars: {
      label: 'Branch cards',
      schema: fields.object({
        pillars: fields.array(
          fields.object({
            branch: branch('Branch'),
            groups,
          }),
          {
            label: 'Cards',
            description: 'One card per branch, at most three. They show in branch order.',
            itemLabel: (props) =>
              branchOptions.find((option) => option.value === props.fields.branch.value)?.label ??
              'Card',
            validation: { length: { min: 1, max: 3 } },
          },
        ),
      }),
    },
  },
  {
    label: 'Content',
    description: 'Paragraphs, lists, panels and cards, in the order they appear.',
    validation: { length: { min: 1 } },
  },
);

// ---------------------------------------------------------------------------
// Collections

const caseStudies = collection({
  label: 'Case studies',
  path: 'src/content/case-studies/*',
  format: 'json',
  slugField: 'name',
  columns: ['order'],
  previewUrl: preview('/projects/{slug}/'),
  schema: {
    name: fields.slug({
      name: { label: 'Project name', validation: { isRequired: true } },
      slug: {
        label: 'Web address',
        description:
          'The end of the page address: /projects/web-address/. Changing it later breaks old links.',
      },
    }),
    meta: meta(),
    order: order('Where it sits on the Projects page and in the Next project loop. 1 comes first.'),
    draft: fields.checkbox({
      label: 'Draft',
      description: 'Drafts stay off the site until you untick this.',
    }),
    featured: fields.checkbox({
      label: 'Show on the homepage',
      description: 'Featured projects appear under Selected work on the homepage.',
    }),
    homeTitle: optional('Homepage card title', {
      description: 'Leave empty to use the Projects card line.',
    }),
    homeSector: optional('Homepage card sector', {
      description: 'Leave empty to use the sector line.',
    }),
    branches: branchList(
      'Branches',
      'The branches that worked on the project. They show as coloured dots and drive the Projects filters.',
    ),
    sector: caps(
      'Sector line',
      'Shown in capitals above the project name, such as RETAIL · MALTA.',
    ),
    accent: fields.select({
      label: 'Number colour',
      description: 'The colour of the section numbers and list numbers.',
      options: [
        { label: 'Anchovy', value: 'anchovy' },
        { label: 'Olive', value: 'olive' },
      ],
      defaultValue: 'anchovy',
    }),
    short: required('Projects card line', {
      multiline: true,
      description: 'One sentence about the project, shown on the Projects page card.',
    }),
    summary: required('Summary', {
      multiline: true,
      description: 'The paragraph next to the project name at the top of the page.',
    }),
    facts: fields.array(
      fields.object({
        k: caps('Label'),
        v: required('Value'),
      }),
      {
        label: 'Facts',
        description: 'The four facts under the main image: client, sector, branches and services.',
        itemLabel: (props) => props.fields.k.value || 'Fact',
        validation: { length: { min: 4, max: 4 } },
      },
    ),
    cover: fields.object(
      {
        src: imageField('Image', 'case-studies'),
        alt: optional('Alt text', {
          description:
            'Usually empty: the card already names the project. Describe the image only if it shows something the card text doesn’t.',
        }),
      },
      { label: 'Card image', description: 'Shown on the Projects page and homepage cards.' },
    ),
    hero: picture('Main image', 'The large image at the top of the page.'),
    gallery: fields.array(picture('Image'), {
      label: 'Gallery',
      description: 'Up to three images at the end of the page.',
      itemLabel: (props) => props.fields.alt.value || 'Image',
      validation: { length: { max: 3 } },
    }),
    sections: fields.array(
      fields.object({
        title: required('Section title'),
        featured: fields.checkbox({
          label: 'Highlight this section',
          description: 'A pale pepper band with larger text. Use it for the outcome.',
        }),
        blocks,
      }),
      {
        label: 'Sections',
        description: 'Each section gets a number and its own band, in this order.',
        itemLabel: (props) => props.fields.title.value || 'Section',
        validation: { length: { min: 1 } },
      },
    ),
  },
});

const testimonials = collection({
  label: 'Testimonials',
  path: 'src/content/testimonials/*',
  format: 'json',
  slugField: 'name',
  columns: ['homeOrder'],
  schema: {
    name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
    role: required('Role and business', { description: 'Such as Owner, CS Butcher.' }),
    quote: required('Quote', { multiline: true }),
    caseStudy: fields.relationship({
      label: 'Project',
      collection: 'caseStudies',
      description: 'READ THE PROJECT under the quote links here.',
      validation: { isRequired: true },
    }),
    homeOrder: fields.integer({
      label: 'Position on the homepage',
      description:
        'Where it sits in the homepage rotator. 1 comes first. Leave empty to keep it off the homepage.',
      validation: { min: 1 },
    }),
    markColor: fields.select({
      label: 'Quote mark colour',
      description: 'Usually the colour of the main branch on the project.',
      options: [
        { label: 'Olive', value: 'olive' },
        { label: 'Anchovy', value: 'anchovy' },
        { label: 'Pepper', value: 'pepper' },
      ],
      defaultValue: 'olive',
    }),
  },
});

const services = collection({
  label: 'Services',
  path: 'src/content/services/*',
  format: 'json',
  slugField: 'name',
  columns: ['number'],
  schema: {
    name: fields.slug({ name: { label: 'Service name', validation: { isRequired: true } } }),
    branch: branch('Branch', 'The Services page section it appears in.'),
    number: fields.text({
      label: 'Service number',
      description:
        'The branch number, a full stop and its position: 01.2 is the second Plan service.',
      validation: {
        isRequired: true,
        pattern: { regex: /^\d{2}\.\d+$/, message: 'Use a number such as 01.2.' },
      },
    }),
    order: order('Where it sits within its branch. 1 comes first.'),
    description: required('Description', { multiline: true }),
    bestFor: required('Best for', { multiline: true }),
    included: fields.array(required('Item'), {
      label: 'What is included',
      description:
        'The list in the WHAT IS INCLUDED drop-down. A service needs this list or How it starts.',
      itemLabel: (props) => props.value || 'Item',
    }),
    howItStarts: optional('How it starts', { multiline: true }),
    phases: fields.array(
      fields.object({
        title: required('Phase'),
        description: required('Description', { multiline: true }),
      }),
      {
        label: 'Phases',
        description: 'Optional numbered steps, as on Web design and development.',
        itemLabel: (props) => props.fields.title.value || 'Phase',
      },
    ),
  },
});

const team = collection({
  label: 'Team',
  path: 'src/content/team/*',
  format: 'json',
  slugField: 'name',
  columns: ['order'],
  schema: {
    name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
    role: caps('Role'),
    bio: required('Bio', { multiline: true }),
    branches: branchList('Branches', 'The branches they lead. They show as coloured dots.'),
    portrait: fields.image({
      label: 'Portrait',
      description: 'Leave empty to keep the placeholder.',
      directory: 'src/assets/content/team',
      publicPath: '../../assets/content/team/',
    }),
    alt: optional('Portrait alt text', {
      description:
        'Needed once there is a portrait. Describe the photo, such as “Maronia smiling at her desk”.',
    }),
    order: order('Where they sit on the About page. 1 comes first.'),
  },
});

// ---------------------------------------------------------------------------
// Singletons

const home = singleton({
  label: 'Homepage',
  path: 'src/content/homepage/home',
  format: 'json',
  previewUrl: preview('/'),
  schema: {
    meta: meta(),
    hero: fields.object(
      {
        eyebrow: required('Small line above the headline'),
        eyebrowShort: caps('Small line on phones'),
        title: required('Headline'),
        body: required('Text', { multiline: true }),
        work: fields.object(
          {
            label: required('Button text'),
            labelShort: required('Button text on phones'),
            href: required('Link address'),
          },
          { label: 'Second button' },
        ),
        markAlt: required('Mark alt text'),
      },
      {
        label: 'Hero',
        description:
          'The dark opening band. The first button is the booking button in Site settings.',
      },
    ),
    work: fields.object(
      {
        number: required('Section number'),
        label: required('Section label'),
        link: link('All projects link'),
        cardLink: required('Card link text', { description: 'Shown on desktop under each card.' }),
      },
      {
        label: 'Selected work',
        description: 'The cards come from case studies marked Show on the homepage.',
      },
    ),
    testimonials: fields.object(
      {
        number: required('Section number'),
        title: caps('Section label'),
        controlsLabel: required('Dots label (screen readers)'),
        pause: caps('Pause button'),
        play: caps('Play button'),
        pauseLabel: required('Pause button (screen readers)'),
        playLabel: required('Play button (screen readers)'),
        slideLabel: required('Slide name (screen readers)', {
          description: '{index}, {total} and {name} are filled in for each testimonial.',
        }),
        roleDescription: required('Rotator type (screen readers)'),
        slideRoleDescription: required('Slide type (screen readers)'),
      },
      {
        label: 'In their words',
        description:
          'The testimonial rotator. The quotes come from Testimonials with a homepage position.',
      },
    ),
    story: fields.object(
      {
        label: required('Section label'),
        headline: required('Headline'),
        body: required('Text', { multiline: true }),
        markAlt: required('Illustration alt text'),
        link: link('Link'),
      },
      { label: 'Where the name comes from' },
    ),
  },
});

const aboutBranch = (key: BranchKey) =>
  fields.object(
    {
      description: required('Description', { multiline: true }),
      services: list('Services', 'Service', 'The list on desktop.'),
      servicesShort: required('Services on phones', {
        description: 'One line, with · between services.',
      }),
    },
    { label: branches[key].name },
  );

const about = singleton({
  label: 'About page',
  path: 'src/content/about/page',
  format: 'json',
  previewUrl: preview('/about/'),
  schema: {
    meta: meta(),
    opening: fields.object(
      {
        eyebrow: caps('Chip above the headline'),
        headline: required('Headline'),
        body: required('Text', { multiline: true }),
        markAlt: required('Mark alt text'),
      },
      { label: 'Opening' },
    ),
    gilda: fields.object(
      {
        label: caps('Label'),
        body: required('Definition', { multiline: true }),
        statement: required('Statement', { multiline: true }),
      },
      { label: 'The gilda' },
    ),
    studio: fields.object(
      {
        ...section('Section'),
        pillars: fields.array(
          fields.object({ title: required('Title'), body: required('Text', { multiline: true }) }),
          {
            label: 'Points',
            description: 'Exactly three.',
            itemLabel: (props) => props.fields.title.value || 'Point',
            validation: { length: { min: 3, max: 3 } },
          },
        ),
      },
      { label: 'One studio' },
    ),
    branches: fields.object(
      {
        ...section('Section'),
        body: required('Text', { multiline: true }),
        copy: fields.object(
          { plan: aboutBranch('plan'), build: aboutBranch('build'), grow: aboutBranch('grow') },
          { label: 'Branches' },
        ),
      },
      { label: 'Plan · Build · Grow' },
    ),
    team: fields.object(
      { ...section('Section'), body: required('Text', { multiline: true }) },
      { label: 'Who we are', description: 'The people come from Team.' },
    ),
    cta: cta(),
  },
});

const branchText = (label: string, description?: string) =>
  fields.object(
    {
      plan: required(branches.plan.name, { multiline: true }),
      build: required(branches.build.name, { multiline: true }),
      grow: required(branches.grow.name, { multiline: true }),
    },
    { label, description },
  );

const servicesPage = singleton({
  label: 'Services page',
  path: 'src/content/services-page/page',
  format: 'json',
  previewUrl: preview('/services/'),
  schema: {
    meta: meta(),
    opening: fields.object(
      {
        eyebrow: caps('Chip above the headline'),
        eyebrowShort: caps('Chip on phones'),
        headline: required('Headline'),
        body: required('Text', { multiline: true }),
      },
      { label: 'Opening' },
    ),
    jump: fields.object(
      {
        label: required('Links label (screen readers)'),
        lists: branchText('Service lists', 'The line under each branch link, in capitals.'),
      },
      { label: 'Branch links' },
    ),
    branchIntros: branchText('Branch introductions', 'The line at the top of each branch section.'),
    labels: fields.object(
      {
        bestFor: caps('Best for'),
        included: caps('What is included'),
        ask: caps('Ask about this service'),
        howItStarts: caps('How it starts'),
        phases: caps('Phases'),
      },
      { label: 'Service labels' },
    ),
    cta: cta(),
  },
});

const projectsPage = singleton({
  label: 'Projects page',
  path: 'src/content/projects/page',
  format: 'json',
  previewUrl: preview('/projects/'),
  schema: {
    meta: meta(),
    countLabel: caps(
      'Count chip',
      '{shown} and {total} are filled in, such as PROJECTS · 03 / 03.',
    ),
    headline: required('Headline'),
    body: required('Text', { multiline: true }),
    bodyShort: required('Text on phones', { multiline: true }),
    filter: fields.object(
      {
        label: required('Filters label (screen readers)'),
        all: caps('All button'),
        status: required('Filter result (screen readers)', {
          description: '{shown} and {total} are filled in after each filter change.',
        }),
      },
      { label: 'Filters', description: 'The branch buttons use the branch names.' },
    ),
    cardLink: caps('Card link text'),
    cta: cta(),
  },
});

const caseStudyPage = singleton({
  label: 'Case study pages',
  path: 'src/content/case-study/page',
  format: 'json',
  schema: {
    allProjects: link('Back link'),
    highlightLabel: caps('Default highlight label', 'Used when a highlight panel has no label.'),
    pillarCount: caps('Branch card count', '{n} is the number of items, such as 4 THINGS WE DID.'),
    pillarCountOne: caps('Branch card count for one item'),
    nextProject: caps('Next project label'),
    galleryLabel: required('Gallery label (screen readers)'),
    cta: cta(),
  },
});

const field = (label: string) =>
  fields.object(
    {
      label: caps('Label'),
      hint: optional('Hint', { description: 'Optional help under the field.' }),
    },
    { label },
  );

const contact = singleton({
  label: 'Contact page',
  path: 'src/content/contact/page',
  format: 'json',
  previewUrl: preview('/contact/'),
  schema: {
    meta: meta(),
    eyebrow: caps('Chip above the headline'),
    headline: required('Headline'),
    body: required('Text', { multiline: true }),
    direct: fields.object(
      {
        label: required('Details label (screen readers)'),
        email: caps('Email label'),
        phone: caps('Phone label'),
        based: caps('Location label'),
        basedValue: required('Location'),
      },
      {
        label: 'Contact details',
        description: 'The email address and phone number are in Site settings.',
      },
    ),
    form: fields.object(
      {
        title: required('Form headline'),
        intro: required('Form introduction', { multiline: true }),
        optional: caps('Optional tag'),
        fields: fields.object(
          {
            name: field('Name'),
            email: field('Email'),
            business: field('Business name'),
            phone: field('Phone'),
            message: field('Message'),
          },
          { label: 'Fields' },
        ),
        needs: fields.object(
          { legend: caps('Question'), unsure: required('Not sure option') },
          { label: 'What do you need?', description: 'The other options are the branch names.' },
        ),
        preferred: fields.object(
          {
            legend: caps('Question'),
            email: required('Email option'),
            call: required('Call option'),
            meeting: required('Meeting option'),
          },
          { label: 'Preferred contact' },
        ),
        submit: required('Send button'),
        sending: required('Send button while sending'),
        submissionError: required('Message when sending fails', { multiline: true }),
        verificationRequired: required('Message while spam verification is incomplete'),
        noJavaScript: required('Email fallback when JavaScript is disabled'),
        delivery: fields.object(
          {
            subject: required('Subject of enquiry notification emails'),
            service: required('Service field label in notification emails'),
            branch: required('Branch field label in notification emails'),
          },
          { label: 'Enquiry notification email' },
        ),
        honeypot: required('Spam trap label (hidden)'),
        servicePrefill: required('Message from a service link', {
          description:
            'Filled in when someone comes from ASK ABOUT THIS SERVICE. {service} is the service name.',
        }),
        errors: fields.object(
          {
            name: required('Name missing'),
            email: required('Email missing'),
            emailFormat: required('Email not valid'),
            phone: required('Phone missing'),
            message: required('Message missing'),
          },
          { label: 'Error messages' },
        ),
        summary: fields.object(
          {
            one: required('One field'),
            many: required('Several fields', { description: '{n} is the number of fields.' }),
          },
          { label: 'Error summary' },
        ),
        success: fields.object(
          { title: required('Headline'), body: required('Text', { multiline: true }) },
          { label: 'Message sent' },
        ),
      },
      { label: 'Form' },
    ),
  },
});

const navLink = fields.object({
  label: required('Link text'),
  href: required('Link address'),
  branch: fields.select({
    label: 'Branch',
    description: 'Branch links take the branch colour when you are on that page.',
    options: [{ label: 'None', value: 'none' }, ...branchOptions],
    defaultValue: 'none',
  }),
});

const links = (label: string, min = 0) =>
  fields.array(link('Link'), {
    label,
    itemLabel: (props) => props.fields.label.value || 'Link',
    validation: { length: { min } },
  });

const settings = singleton({
  label: 'Site settings',
  path: 'src/content/settings/site',
  format: 'json',
  schema: {
    seo: fields.object(
      {
        siteUrl: fields.text({
          label: 'Public site address',
          description:
            'The live HTTPS origin, with no path. Change to https://www.thegildastudios.com when the domain is connected. Preview domains never belong here.',
          validation: {
            isRequired: true,
            pattern: {
              regex: /^https:\/\/[^/?#@:]+(?::\d+)?\/?$/,
              message: 'Use an HTTPS origin without a path, query or fragment.',
            },
          },
        }),
        defaultTitle: required('Default page title'),
        homeTitle: required('Default homepage title'),
        defaultDescription: required('Default search description', { multiline: true }),
        language: fields.select({
          label: 'Page language',
          description: 'English as used in Malta, pending confirmation.',
          options: [
            { label: 'English (Malta)', value: 'en-MT' },
            { label: 'English', value: 'en' },
          ],
          defaultValue: 'en-MT',
        }),
        locale: fields.select({
          label: 'Social preview locale',
          description: 'Use the locale matching the page language.',
          options: [
            { label: 'English (Malta)', value: 'en_MT' },
            { label: 'English (UK)', value: 'en_GB' },
          ],
          defaultValue: 'en_MT',
        }),
        socialProfiles: fields.array(
          fields.text({
            label: 'Profile address',
            description: 'A confirmed public HTTPS social profile for this studio.',
            validation: {
              isRequired: true,
              pattern: {
                regex: /^https:\/\/[^\s]+$/,
                message: 'Use a full HTTPS profile address.',
              },
            },
          }),
          {
            label: 'Social profiles',
            description: 'Leave empty until Chris supplies them.',
            itemLabel: (props) => props.value || 'Profile',
          },
        ),
        locality: optional('Public locality', {
          description: 'Leave empty until Chris confirms which locality may be published.',
        }),
        streetAddress: optional('Public street address', {
          description: 'Only enter an address approved for publication.',
        }),
        postalCode: optional('Public postal code'),
        publishedPhone: optional('Confirmed public phone', {
          description: 'Leave empty while the contact number is a placeholder. Include +356.',
        }),
        homeLabel: required('Home breadcrumb label'),
        projectsLabel: required('Projects breadcrumb label'),
      },
      {
        label: 'Search and social previews',
        description: 'Defaults, production URLs and public business details used in metadata.',
      },
    ),
    nav: fields.array(navLink, {
      label: 'Main navigation',
      description: 'The header links, in order.',
      itemLabel: (props) => props.fields.label.value || 'Link',
    }),
    booking: link('Booking button', 'The button in the header and the hero.'),
    email: fields.text({
      label: 'Email address',
      validation: {
        isRequired: true,
        pattern: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter an email address.' },
      },
    }),
    phone: fields.object(
      {
        label: required('Phone number as shown', { description: 'Such as +356 2123 4567.' }),
        href: required('Phone link', {
          description: 'tel: and the number without spaces, such as tel:+35621234567.',
        }),
      },
      { label: 'Phone' },
    ),
    footer: fields.object(
      {
        navLabel: required('Footer label (screen readers)'),
        studioLabel: required('Studio column heading'),
        projectsLabel: required('Projects column heading'),
        contactLabel: required('Contact column heading'),
        studioLinks: links('Studio links'),
        projectLinks: links('Projects links', 1),
        copyright: caps('Bottom line'),
        copyrightShort: caps('Bottom line on phones'),
      },
      { label: 'Footer' },
    ),
    brand: fields.object(
      {
        name: required('Studio name'),
        stacked: fields.array(required('Word'), {
          label: 'Stacked name',
          description: 'The name on three lines, one word each.',
          itemLabel: (props) => props.value || 'Word',
          validation: { length: { min: 3, max: 3 } },
        }),
        monogram: required('Monogram', {
          description: 'The letters used when the mark is too small.',
        }),
        markLabel: required('Mark alt text'),
      },
      { label: 'Studio name' },
    ),
    header: fields.object(
      {
        skip: caps('Skip link, shown on keyboard focus'),
        nav: required('Navigation label (screen readers)'),
        home: required('Home link label (screen readers)'),
        menu: caps('Menu button'),
        close: caps('Close button'),
        menuTitle: required('Menu label (screen readers)'),
      },
      { label: 'Header' },
    ),
    labels: fields.object(
      {
        disclosure: fields.object(
          {
            show: caps('Show', '{n} is the number of items.'),
            hide: caps('Hide'),
            compact: caps('Short label'),
            showOne: caps('Show, for one item'),
            hideOne: caps('Hide, for one item'),
            compactOne: caps('Short label, for one item'),
          },
          { label: 'What is included drop-down' },
        ),
        testimonial: fields.object(
          {
            figureLabel: required('Testimonial label (screen readers)'),
            projectLink: caps('Project link'),
          },
          { label: 'Testimonials' },
        ),
        hero: fields.object(
          {
            pieces: required('Mark controls label (screen readers)'),
            explore: caps('Branch strip link'),
          },
          { label: 'Homepage hero' },
        ),
      },
      { label: 'Shared labels' },
    ),
  },
});

const branchCopy = (key: BranchKey) =>
  singleton({
    label: `${branches[key].number} ${branches[key].name}`,
    path: `src/content/branches/${key}`,
    format: 'json',
    schema: {
      line: required('Homepage line', {
        multiline: true,
        description: 'The sentence in the homepage branch strip.',
      }),
      services: list(
        'Homepage services',
        'Service',
        'Shown in the branch strip, with · between them.',
      ),
    },
  });

const systemPage = (label: string, file: string, previewUrl: string) =>
  singleton({
    label,
    path: `src/content/system-pages/${file}`,
    format: 'json',
    previewUrl: preview(previewUrl),
    schema: {
      meta: meta(),
      eyebrow: caps('Small line above the headline'),
      headline: required('Headline'),
      body: required('Text', { multiline: true }),
      navLabel: required('Links label (screen readers)'),
      links: links('Links', 1),
    },
  });

export default config({
  storage,
  ui: {
    brand: { name: 'The Gilda Studios' },
    navigation: {
      Pages: ['home', 'about', 'servicesPage', 'projectsPage', 'caseStudyPage', 'contact'],
      Content: ['caseStudies', 'testimonials', 'services', 'team'],
      Site: ['settings', 'branchPlan', 'branchBuild', 'branchGrow', 'notFound', 'contactThanks'],
    },
  },
  collections: { caseStudies, testimonials, services, team },
  singletons: {
    home,
    about,
    servicesPage,
    projectsPage,
    caseStudyPage,
    contact,
    settings,
    branchPlan: branchCopy('plan'),
    branchBuild: branchCopy('build'),
    branchGrow: branchCopy('grow'),
    notFound: systemPage('Page not found', 'not-found', '/404/'),
    contactThanks: systemPage('Message sent', 'contact-thanks', '/contact/thanks/'),
  },
});
