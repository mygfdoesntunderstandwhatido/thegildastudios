interface TestimonialSample {
  quote: string;
  name: string;
  business: string;
  caseStudy: { slug: string };
  markColor: 'olive' | 'anchovy' | 'pepper';
}

interface TestimonialPreview {
  title: string;
  heading: string;
  intro: string;
  dark: string;
  light: string;
  sand: string;
  samples: TestimonialSample[];
}

export const testimonialPreview: TestimonialPreview = {
  title: 'Testimonial · dev',
  heading: 'In their words.',
  intro:
    'The dark homepage and light case-study variants, using the original client words. Project links use the slugs specified in issue #25; those pages arrive with the case studies.',
  dark: 'Dark · Homepage',
  light: 'Light · Cream',
  sand: 'Light · Sand',
  samples: [
    {
      quote:
        "Working with the team gave our business a new direction at a time when we really needed it. They took the time to understand our challenges and helped us find practical ways to adapt to how customers shop today. From introducing online ordering and home delivery to improving our social media presence and advertising, they helped us modernise while staying true to the quality and personal service we've always been known for. Their support and fresh ideas have made a real difference to our business, and we're very happy with the results.",
      name: 'Carmelo Vella',
      business: 'Owner, CS Butcher',
      caseStudy: { slug: 'cs-butcher' },
      markColor: 'anchovy',
    },
    {
      quote:
        'Maronia is meticulous in her way, highly organised and well disciplined which for the assistance we need at the Malta Business Network works extremely well. She is highly proactive and responsive in ensuring deadlines are met.',
      name: 'Christopher Naudi',
      business: 'Treasurer, Malta Business Network',
      caseStudy: { slug: 'malta-business-network' },
      markColor: 'olive',
    },
  ],
};
