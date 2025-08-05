import { InjectionToken } from '@angular/core';
import { AppRouteEnum } from '@core/enums/app-route.enum';

export interface NavItem {
  path: string;
  label: string;
}

export const NAVIGATION: NavItem[] = [
  { path: AppRouteEnum.Home, label: 'Home' },
  { path: AppRouteEnum.Parser, label: 'Parser' },
  { path: AppRouteEnum.Generator, label: 'Generator' },
  { path: AppRouteEnum.Docs, label: 'Docs' },
];

export const NAVIGATION_TOKEN = new InjectionToken<NavItem[]>('NAVIGATION');
