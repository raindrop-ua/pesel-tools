import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { APP_CONFIG } from './config.token';
import { environment } from '../environments/environment';

export function provideEnvironment(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: environment.apiUrl,
        enableLogging: environment.enableLogging,
      },
    },
  ]);
}
