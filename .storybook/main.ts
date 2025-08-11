import type { StorybookConfig } from '@analogjs/storybook-angular';
import { mergeConfig, type UserConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
  staticDirs: [{ from: '../src/assets', to: '/assets' }],
};
export default config;

export async function viteFinal(cfg: UserConfig) {
  return mergeConfig(cfg, {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['src'],
        },
      },
    },
    plugins: [viteTsconfigPaths()],
  });
}
