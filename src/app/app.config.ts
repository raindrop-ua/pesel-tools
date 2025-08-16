import {
  ApplicationConfig,
  provideEnvironmentInitializer,
  isDevMode,
  inject,
  PLATFORM_ID,
  provideZonelessChangeDetection,
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

import { provideEnvironment } from './environment.providers';
import { provideServiceWorker } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';
import { NAVIGATION, NAVIGATION_TOKEN } from '@core/config/navigation.config';
import { routes } from './app.routes';
import { AfterFirstPaintPreloadingStrategy } from '@core/strategies/after-first-paint-preloading.strategy';
import { SwUpdateService } from '@services/sw-update.service';
import { SeoService } from '@services/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NAVIGATION_TOKEN, useValue: NAVIGATION },
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(AfterFirstPaintPreloadingStrategy),
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
    provideEnvironmentInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        inject(SwUpdateService);
      }
      inject(SeoService);
    }),
  ],
};
