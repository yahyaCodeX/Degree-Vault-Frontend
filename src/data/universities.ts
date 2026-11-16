export interface University {
  code: string;
  name: string;
  city: string;
  logo: string;
}

export const UNIVERSITIES: University[] = [
  { code: 'MUET', name: 'Mehran University of Engineering & Technology', city: 'Jamshoro', logo: '/logos/muet.svg' },
  { code: 'NED', name: 'NED University of Engineering & Technology', city: 'Karachi', logo: '/logos/ned.svg' },
  { code: 'NUST', name: 'National University of Sciences & Technology', city: 'Islamabad', logo: '/logos/nust.svg' },
  { code: 'FAST', name: 'FAST National University (NUCES)', city: 'Multi-campus', logo: '/logos/fast.svg' },
];

export const findUniversity = (code?: string): University | undefined =>
  UNIVERSITIES.find((u) => u.code === code?.trim().toUpperCase());
