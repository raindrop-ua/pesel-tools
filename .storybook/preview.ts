import 'zone.js';
import '../src/styles.scss';

import type { Preview } from '@storybook/angular';
import { expect } from 'storybook/test';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

import { applicationConfig } from '@storybook/angular';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { element: '#storybook-root', manual: false },
    layout: 'fullscreen',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
      ],
    }),
    (story, ctx) => {
      document.documentElement.dataset['theme'] =
        (ctx.globals['theme'] as string) || 'light';
      return story();
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme',
      defaultValue: 'light',
      toolbar: { icon: 'circlehollow', items: ['light', 'dark'] },
    },
  },
};

export default preview;
