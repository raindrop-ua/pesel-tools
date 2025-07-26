import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        data: { preload: true },
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'parser',
        data: { preload: true },
        loadComponent: () =>
          import('./features/parser/parser.component').then(
            (m) => m.ParserComponent,
          ),
      },
      {
        path: 'generator',
        data: { preload: true },
        loadComponent: () =>
          import('./features/generator/generator.component').then(
            (m) => m.GeneratorComponent,
          ),
      },
      {
        path: 'doc',
        data: { preload: true },
        loadComponent: () =>
          import('./features/doc/doc.component').then((m) => m.DocComponent),
      },
      {
        path: '**',
        data: { preload: false },
        loadComponent: () =>
          import('./features/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
];
