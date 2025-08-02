import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { routes } from './app.routes';
import { provideEnvironment } from './environment.providers';
import { CustomPreloadingStrategy } from '@core/strategies/custom-preloading.strategy';
import { provideServiceWorker } from '@angular/service-worker';
import { NAVIGATION, NAVIGATION_TOKEN } from '@config/navigation.config';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NAVIGATION_TOKEN, useValue: NAVIGATION },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(CustomPreloadingStrategy),
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideEnvironment(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
