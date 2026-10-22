import type { BranchKey } from '../../lib/branches';

interface BrandGround {
  id: string;
  label: string;
  className: string;
  onDark: boolean;
}

interface BrandPreview {
  title: string;
  heading: string;
  intro: string;
  grounds: BrandGround[];
  sections: {
    mark: string;
    markFull: string;
    markSingle: string;
    markDecorative: string;
    markSmall: string;
    wordmark: string;
    wordmarkLine: string;
    wordmarkStacked: string;
    lockup: string;
    monogram: string;
    dots: string;
    dotsAll: string;
    dotsSubset: string;
    dotsSizes: string;
  };
  subsetLabel: string;
  subset: BranchKey[];
}

export const brandPreview: BrandPreview = {
  title: 'Brand · dev',
  heading: 'The mark, the name and the dots.',
  intro:
    'Every brand component on Cream, Sand, Brine and Anchovy. The Plan and Grow dots are passed in the order Grow, Plan and still render olive first. Marks below 48px fall back to the GS monogram.',
  grounds: [
    { id: 'cream', label: 'Cream', className: 'band--cream', onDark: false },
    { id: 'sand', label: 'Sand', className: 'band--sand', onDark: false },
    { id: 'brine', label: 'Brine', className: 'band--brine', onDark: true },
    { id: 'anchovy', label: 'Anchovy', className: 'band--anchovy', onDark: true },
  ],
  sections: {
    mark: 'Mark',
    markFull: 'Full colour · 120px',
    markSingle: 'Single colour · 120px',
    markDecorative: 'Single colour · decorative',
    markSmall: 'Below 48px · 40px',
    wordmark: 'Wordmark',
    wordmarkLine: 'Line · 26px',
    wordmarkStacked: 'Stacked · 32px',
    lockup: 'Lockup',
    monogram: 'Monogram',
    dots: 'Branch dots',
    dotsAll: 'All three · 10px',
    dotsSubset: 'Grow and Plan, passed in that order',
    dotsSizes: '9px to 14px',
  },
  subsetLabel: 'Plan and Grow',
  subset: ['grow', 'plan'],
};
