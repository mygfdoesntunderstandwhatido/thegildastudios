import type { ButtonVariant, ControlSize, DotColor, LabelTone } from '../../components/core/types';

export const previewGrounds = [
  { id: 'cream', label: 'Cream', className: 'band--cream', onDark: false },
  { id: 'brine', label: 'Brine', className: 'band--brine', onDark: true },
] as const;

interface ButtonPreviewContent {
  title: string;
  heading: string;
  intro: string;
  action: string;
  nativeButton: string;
  disabledButton: string;
  disabledLink: string;
  variants: { value: ButtonVariant; label: string }[];
  sizes: { value: ControlSize; label: string }[];
}

export const buttonPreview: ButtonPreviewContent = {
  title: 'Button · dev',
  heading: 'Buttons and links.',
  intro:
    'Every button variant in both sizes. Light outlines use a dark swatch; dark outlines use a light swatch. Tab through the controls and compare hover and disabled states.',
  action: 'Book a chat',
  nativeButton: 'Button action',
  disabledButton: 'Disabled button',
  disabledLink: 'Disabled link',
  variants: [
    { value: 'primary', label: 'Primary' },
    { value: 'anchovy', label: 'Anchovy' },
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'outline', label: 'Outline' },
    { value: 'outline-light', label: 'Outline light' },
  ],
  sizes: [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
  ],
};

interface LabelPreviewContent {
  title: string;
  heading: string;
  intro: string;
  sample: string;
  running: string;
  tones: { value: LabelTone; label: string; onDark: boolean }[];
}

export const labelPreview: LabelPreviewContent = {
  title: 'Label · dev',
  heading: 'Labels in mono.',
  intro:
    'Each tone at medium and small sizes, with standard and running-header tracking. Samples use the ground suited to their text colour.',
  sample: 'Plan · Build · Grow',
  running: 'The Gilda Studios · Malta',
  tones: [
    { value: 'accent', label: 'Accent', onDark: false },
    { value: 'ink', label: 'Ink', onDark: false },
    { value: 'muted', label: 'Muted', onDark: false },
    { value: 'on-dark', label: 'On dark', onDark: true },
    { value: 'on-dark-accent', label: 'On dark accent', onDark: true },
    { value: 'on-dark-muted', label: 'On dark muted', onDark: true },
    { value: 'inherit', label: 'Inherit', onDark: false },
  ],
};

interface ChipPreviewContent {
  title: string;
  heading: string;
  intro: string;
  outline: string;
  filled: string[];
  toggle: string;
  disabled: string;
  outlineSamples: string[];
  choices: { value: string; label: string; dot?: DotColor }[];
}

export const chipPreview: ChipPreviewContent = {
  title: 'Chip · dev',
  heading: 'Chips and toggles.',
  intro:
    'Static outlined and filled chips, followed by independent toggles. Use Enter or Space to change each toggle’s pressed state.',
  outline: 'Outline',
  filled: ['ABOUT · WHY THE GILDA STUDIOS', 'SERVICES · PLAN · BUILD · GROW', 'PROJECTS · 03 / 03'],
  toggle: 'Toggle',
  disabled: 'Disabled toggle',
  outlineSamples: ['Project management', 'Web design', 'Social media'],
  choices: [
    { value: 'all', label: 'All' },
    { value: 'plan', label: 'Plan', dot: 'olive' },
    { value: 'build', label: 'Build', dot: 'anchovy' },
    { value: 'grow', label: 'Grow', dot: 'pepper' },
  ],
};
