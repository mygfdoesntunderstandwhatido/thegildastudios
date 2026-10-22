import type { BranchKey } from '../../lib/branches';

interface DisclosureSample {
  id: string;
  branch: BranchKey;
  name: string;
  items: string[];
}

interface DisclosurePreview {
  title: string;
  heading: string;
  intro: string;
  rowLabel: string;
  grounds: { id: string; label: string; className: string }[];
  samples: DisclosureSample[];
}

const planItems = [
  'Embedded across the active project slate, with weekly capacity review.',
  'Single point of contact for clients, partners, and internal teams.',
  'Process improvements documented as they are made.',
  'Standing weekly review with you and your team leads.',
  "Clean exit plan available at any point with 30 days' notice.",
];

const eventItems = [
  'Initial briefing and event scoping to define objectives, audience, and requirements.',
  'Event planning and coordination across timelines, logistics, and stakeholders.',
  'Social media marketing to promote events and drive attendance.',
  'Setup and management of event ticketing platforms such as Eventbrite and Ticket Tailor.',
  'Newsletter marketing and email campaigns using platforms such as Mailchimp.',
];

const growItems = [
  'Briefing and scope definition to understand brand goals, audience, and tone of voice.',
  'Content planning and strategy development aligned with business objectives.',
];

export const disclosurePreview: DisclosurePreview = {
  title: 'Disclosure · dev',
  heading: 'What is included.',
  intro:
    'The disclosure with 1, 5 and 12 items in each branch colour. Tab to a trigger and use Enter or Space to open and close it. Without JavaScript every list stays open.',
  rowLabel: 'WHAT IS INCLUDED',
  grounds: [
    { id: 'cream', label: 'Cream', className: 'band--cream' },
    { id: 'sand', label: 'Sand', className: 'band--sand' },
  ],
  samples: [
    { id: 'plan', branch: 'plan', name: 'Plan · 5 items', items: planItems },
    { id: 'build', branch: 'build', name: 'Build · 1 item', items: planItems.slice(0, 1) },
    {
      id: 'grow',
      branch: 'grow',
      name: 'Grow · 12 items',
      items: [...planItems, ...eventItems, ...growItems],
    },
  ],
};
