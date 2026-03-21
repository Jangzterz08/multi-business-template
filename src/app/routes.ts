import type { NavigationCopy, RoutePath } from '../types/preset';

export interface NavRoute {
  path: RoutePath;
  label: string;
}

export function getNavRoutes(copy?: NavigationCopy): NavRoute[] {
  return [
    { path: '/', label: copy?.home ?? 'Home' },
    { path: '/services', label: copy?.services ?? 'Services' },
    { path: '/about', label: copy?.about ?? 'About' },
    { path: '/contact', label: copy?.contact ?? 'Contact' }
  ];
}
