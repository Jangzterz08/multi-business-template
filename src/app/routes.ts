import type { RoutePath } from '../types/preset';

export interface NavRoute {
  path: RoutePath;
  label: string;
}

export const NAV_ROUTES: NavRoute[] = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
];
