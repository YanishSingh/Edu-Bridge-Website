/**
 * Service slugs and labels for routes and navigation.
 * Used by ServicesPage, ServiceDetailPage, and NavigationBar dropdown.
 */
export const SERVICES_LIST = [
  {
    slug: 'career-counseling',
    title: 'Career Counseling',
    shortDesc: 'Align your study path with your long-term career goals.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
  },
  {
    slug: 'interview-preparation',
    title: 'Interview Preparation',
    shortDesc: 'Excel in university and embassy interviews with tailored coaching.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  },
  {
    slug: 'ielts-preparation',
    title: 'IELTS Preparation',
    shortDesc: 'Comprehensive coaching to achieve your target English test scores.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
  },
  {
    slug: 'university-admissions',
    title: 'University Admissions',
    shortDesc: 'End-to-end support for selecting and applying to the right universities.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  },
  {
    slug: 'visa-facilitation',
    title: 'Visa Facilitation',
    shortDesc: 'Expert guidance and documentation support for a smooth visa process.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  },
  {
    slug: 'pre-post-departure',
    title: 'Pre- & Post-Departure Support',
    shortDesc: 'Guidance before you leave and continued support after you arrive.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  },
];

export const getServiceBySlug = (slug) => SERVICES_LIST.find((s) => s.slug === slug);
