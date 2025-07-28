import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        data: {
          preload: true,
          seo: {
            title: 'Home | Ultimate PESEL Tools',
            description: 'Generate and parse PESEL numbers with ease.',
            keywords: 'pesel, pesel parser, pesel generator',
          },
        },
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'parser',
        data: {
          preload: true,
          seo: {
            title: 'Parser | Ultimate PESEL Tools',
            description: 'Parse and validate PESEL numbers.',
            keywords: 'pesel parser, pesel validator',
          },
        },
        loadComponent: () =>
          import('./features/parser/parser.component').then(
            (m) => m.ParserComponent,
          ),
      },
      {
        path: 'generator',
        data: {
          preload: true,
          seo: {
            title: 'Generator | Ultimate PESEL Tools',
            description:
              'Generate valid PESEL numbers by birthdate and gender.',
            keywords: 'pesel generator, birthdate, gender',
          },
        },
        loadComponent: () =>
          import('./features/generator/generator.component').then(
            (m) => m.GeneratorComponent,
          ),
      },
      {
        path: 'docs',
        data: {
          preload: true,
          seo: {
            title: 'Docs | Ultimate PESEL Tools',
            description: 'Documentation and details about PESEL tools.',
            keywords: 'pesel docs, documentation, PESEL tools',
          },
        },
        loadComponent: () =>
          import('./features/doc/doc.component').then((m) => m.DocComponent),
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
          import('./features/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
];
