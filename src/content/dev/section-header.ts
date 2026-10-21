interface HeaderSample {
  number?: string;
  title: string;
  accent?: 'olive' | 'anchovy';
  accentTitle?: boolean;
  link?: { label: string; href: string };
}

interface SectionHeaderPreview {
  title: string;
  heading: string;
  intro: string;
  grounds: { id: string; label: string; className: string; onDark: boolean }[];
  samples: HeaderSample[];
}

export const sectionHeaderPreview: SectionHeaderPreview = {
  title: 'SectionHeader · dev',
  heading: 'A label and a hairline.',
  intro:
    'The section labels from the Homepage, About and Services artboards, with page tracking of 0.06em. The trailing link returns to the top of this preview.',
  grounds: [
    { id: 'cream', label: 'Cream', className: 'band--cream', onDark: false },
    { id: 'sand', label: 'Sand', className: 'band--sand', onDark: false },
    { id: 'brine', label: 'Brine', className: 'band--brine', onDark: true },
  ],
  samples: [
    { number: '01', title: 'Selected work', link: { label: 'All projects', href: '#header-top' } },
    { number: '03', title: 'Where the name comes from' },
    { number: '02', title: 'ONE STUDIO' },
    { number: '03', title: 'PLAN · BUILD · GROW' },
    { number: '04', title: 'WHO WE ARE' },
    { title: 'SIX PHASES', accent: 'anchovy', accentTitle: true },
  ],
};
