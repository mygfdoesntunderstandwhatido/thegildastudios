interface HeaderSample {
  id: string;
  label: string;
  ground: 'cream' | 'sand';
  currentPath: string;
  band: string;
}

export const headerPreview = {
  title: 'Header · dev',
  heading: 'The site header.',
  intro:
    'The page header above uses the Base layout. Below are the current-page states and a header placed at the top of a Brine band, as in the homepage hero. Below 960px each header shows a MENU toggle that opens the full-screen menu.',
  samples: [
    {
      id: 'about',
      label: 'Cream · on About',
      ground: 'cream',
      currentPath: '/about/',
      band: 'band--cream',
    },
    {
      id: 'services',
      label: 'Sand · on Services, where each branch link takes its colour',
      ground: 'sand',
      currentPath: '/services/',
      band: 'band--sand',
    },
    {
      id: 'project',
      label: 'Cream · inside a Brine band, on a case study',
      ground: 'cream',
      currentPath: '/projects/cs-butcher/',
      band: 'band--brine',
    },
  ] satisfies HeaderSample[],
};
