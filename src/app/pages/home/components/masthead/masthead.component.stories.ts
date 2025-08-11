// import { expect, within } from 'storybook/test';
// import { fireEvent } from '@testing-library/dom';

import type { Meta, StoryObj } from '@storybook/angular';
import { MastheadComponent } from './masthead.component';

interface ExtraArgs {
  gradient: string;
  textColor: string;
  effectColor: string;
  attentionColor: string;
  noPulses: boolean;
}

const defaultArgs: ExtraArgs = {
  gradient: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0ea5e9 100%)',
  textColor: '#e2e8f0',
  effectColor: 'rgba(56,189,248,0.8)',
  attentionColor: '#38bdf8',
  noPulses: false,
};

const meta = {
  title: 'Landing/Masthead',
  component: MastheadComponent,
  args: defaultArgs, // важно: boolean, а не литерал "false"
} satisfies Meta<MastheadComponent & ExtraArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

type Render = NonNullable<Story['render']>;
type RenderArgs = Parameters<Render>[0];
type RenderReturn = ReturnType<Render>;

const renderWithVars =
  (extraTemplate = '') =>
  (args: RenderArgs): RenderReturn => ({
    props: args,
    template: `
      <div
        style="
          --masthead-gradient: {{gradient}};
          --masthead-text: {{textColor}};
          --masthead-effect: {{effectColor}};
          --masthead-attention: {{attentionColor}};
          padding: 16px;
          background: radial-gradient(1200px 400px at 70% -200px, rgba(56,189,248,.08), transparent);
        "
      >
        ${extraTemplate}
        <app-masthead></app-masthead>
      </div>
    `,
  });

export const Default: Story = {
  render: renderWithVars(),
};
