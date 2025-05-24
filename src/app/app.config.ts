import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideEnvironment } from './environment.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideEnvironment(),
  ],
};
