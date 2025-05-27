import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        data: { preload: true, animation: 'HomePage' },
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'parser',
        data: { preload: true, animation: 'AboutPage' },
        loadComponent: () =>
          import('./features/parser/parser.component').then(
            (m) => m.ParserComponent,
          ),
      },
      {
        path: 'generator',
        data: { preload: true, animation: 'ContactPage' },
        loadComponent: () =>
          import('./features/generator/generator.component').then(
            (m) => m.GeneratorComponent,
          ),
      },
      {
        path: 'doc',
        data: { preload: true, animation: 'ContactPage' },
        loadComponent: () =>
          import('./features/doc/doc.component').then((m) => m.DocComponent),
      },
      {
        path: '**',
        data: { animation: 'NotFoundPage' },
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
];
