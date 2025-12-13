import { Routes } from '@angular/router';
import { LayoutComponent } from '@core/layout/layout/layout.component';
import { AppRouteEnum } from '@core/enums/app-route.enum';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: AppRouteEnum.Home,
        data: {
          preload: true,
          seo: {
            title: 'Home | Ultimate PESEL Tools',
            description: 'Generate and parse PESEL numbers with ease.',
            keywords: 'pesel, pesel parser, pesel generator',
          },
        },
        loadComponent: () =>
          import('@features/home/feature/home.component').then((m) => m.HomeComponent),
      },
      {
        path: AppRouteEnum.Parser,
        data: {
          preload: true,
          seo: {
            title: 'Parser | Ultimate PESEL Tools',
            description: 'Parse and validate PESEL numbers.',
            keywords: 'pesel parser, pesel validator',
          },
        },
        loadComponent: () =>
          import('@features/parser/feature/parser.component').then(
            (m) => m.ParserComponent,
          ),
      },
      {
        path: AppRouteEnum.Generator,
        data: {
          preload: true,
          seo: {
            title: 'Generator | Ultimate PESEL Tools',
            description: 'Generate valid PESEL numbers by birthdate and sex.',
            keywords: 'pesel generator, birthdate, sex',
          },
        },
        loadComponent: () =>
          import('@features/generator/feature/generator.component').then(
            (m) => m.GeneratorComponent,
          ),
      },
      {
        path: AppRouteEnum.Docs,
        data: {
          preload: true,
          seo: {
            title: 'Docs | Ultimate PESEL Tools',
            description: 'Documentation and details about PESEL tools.',
            keywords: 'pesel docs, documentation, PESEL tools',
          },
        },
        loadComponent: () =>
          import('@features/static/doc/feature/doc.component').then((m) => m.DocComponent),
      },
      {
        path: '**',
        data: {
          preload: false,
          seo: {
            title: '404 | Page Not Found',
            description: 'This page does not exist.',
            keywords: '404, not found',
          },
        },
        loadComponent: () =>
          import('@features/static/not-found/feature/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
];
