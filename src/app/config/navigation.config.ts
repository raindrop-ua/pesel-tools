export interface NavItem {
  path: string;
  label: string;
}

export const NAVIGATION: NavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/parser', label: 'Parser' },
  { path: '/generator', label: 'Generator' },
  { path: '/docs', label: 'Docs' },
];
