interface BandSpecimen {
  id: string;
  className: string;
  label: string;
  title: string;
}

interface GridSpecimen {
  className: string;
  label: string;
  columns: string[];
}

interface BaseStylesContent {
  title: string;
  label: string;
  heading: string;
  intro: string;
  bandBody: string;
  link: string;
  rules: { opening: string; row: string; soft: string };
  bands: BandSpecimen[];
  decoration: { label: string; heading: string; body: string };
  layout: { label: string; heading: string; body: string; grids: GridSpecimen[] };
  nested: { label: string; heading: string; body: string };
}

export const baseStylesContent: BaseStylesContent = {
  title: 'Base styles · dev',
  label: 'The Gilda Studios · Foundations',
  heading: 'The shared foundations.',
  intro:
    'Band colours, typography, links, keyboard focus, rules and responsive grids. Tab through the links to check focus on each ground.',
  bandBody:
    'Body copy uses Archivo at 17px with 1.6 leading. Headlines use Gilda Display, and labels use IBM Plex Mono in uppercase.',
  link: 'View the layout samples',
  rules: {
    opening: 'Opening rule · 2px',
    row: 'Row rule · 1px · 25%',
    soft: 'Soft row rule · 1px · 20% on light, 25% on dark',
  },
  bands: [
    { id: 'cream', className: 'band--cream', label: 'Cream', title: 'The page ground.' },
    { id: 'sand', className: 'band--sand', label: 'Sand', title: 'An alternate ground.' },
    { id: 'brine', className: 'band--brine', label: 'Brine', title: 'A dark band.' },
    {
      id: 'pepper-pale',
      className: 'band--pepper-pale',
      label: 'Pepper pale',
      title: 'A light highlight.',
    },
    { id: 'olive', className: 'band--olive', label: 'Olive · Plan', title: 'The Plan ground.' },
    {
      id: 'anchovy',
      className: 'band--anchovy',
      label: 'Anchovy · Build',
      title: 'The Build ground.',
    },
    { id: 'pepper', className: 'band--pepper', label: 'Pepper · Grow', title: 'The Grow ground.' },
  ],
  decoration: {
    label: 'Dark band decoration',
    heading: 'A mark at the edge.',
    body: 'The engraved mark sits behind the content, with the placement and olive tint from the About artboard.',
  },
  layout: {
    label: 'Layout samples',
    heading: 'Shared grids and gutters.',
    body: 'Bands fill the viewport. Content has 56px desktop gutters and 24px phone gutters, with a maximum content width of 1280px. Each grid stacks on phone.',
    grids: [
      { className: 'grid--three', label: 'Three equal columns', columns: ['One', 'Two', 'Three'] },
      { className: 'grid--5-7', label: '5 / 7 split', columns: ['Five', 'Seven'] },
      { className: 'grid--6-5', label: '6 / 5 split', columns: ['Six', 'Five'] },
      { className: 'grid--4-8', label: '4 / 8 split', columns: ['Four', 'Eight'] },
    ],
  },
  nested: {
    label: 'Nested band',
    heading: 'Light inside dark.',
    body: 'Light bands restore the body, link, focus and rule colours even when nested inside a dark band.',
  },
};
