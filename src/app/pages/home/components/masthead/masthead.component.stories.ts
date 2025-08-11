import type { Meta, StoryObj } from '@storybook/angular';
// import { expect, within } from 'storybook/test';
// import { fireEvent } from '@testing-library/dom';

import { MastheadComponent } from './masthead.component';

const meta: Meta<
  MastheadComponent & {
    gradient: string;
    textColor: string;
    effectColor: string;
    attentionColor: string;
    noPulses: boolean;
  }
> = {
  title: 'Landing/Masthead',
  component: MastheadComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    gradient: { control: 'text', description: 'CSS gradient for background' },
    textColor: { control: 'color' },
    effectColor: { control: 'color' },
    attentionColor: { control: 'color' },
    noPulses: { control: 'boolean', description: 'Hide pulse rings' },
  },
  args: {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0ea5e9 100%)',
    textColor: '#e2e8f0',
    effectColor: 'rgba(56, 189, 248, 0.8)',
    attentionColor: '#38bdf8',
    noPulses: false,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const renderWithVars =
  (extraTemplate = '') =>
  (args: any) => ({
    props: args,
    template: `
      <div
        style="
          --masthead-gradient: ${'{{gradient}}'};
          --masthead-text: ${'{{textColor}}'};
          --masthead-effect: ${'{{effectColor}}'};
          --masthead-attention: ${'{{attentionColor}}'};
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

// Тёмно-фиолетовая тема
// export const VioletTheme: Story = {
//   args: {
//     gradient: 'linear-gradient(135deg, #0b1220 0%, #1b1036 55%, #6d28d9 100%)',
//     textColor: '#ede9fe',
//     effectColor: 'rgba(167, 139, 250, 0.8)',
//     attentionColor: '#a78bfa',
//   },
//   render: renderWithVars(),
// };

// Без пульсаций (только текст + параллакс-картинка)
// export const NoPulses: Story = {
//   args: { noPulses: true },
//   render: (args) => ({
//     props: args,
//     template: `
//       <style>
//         /* Спрячем пульсы только в этой сторис */
//         .masthead .pulses { display: none !important; }
//       </style>
//       <div
//         style="
//           --masthead-gradient: ${args.gradient};
//           --masthead-text: ${args.textColor};
//           --masthead-effect: ${args.effectColor};
//           --masthead-attention: ${args.attentionColor};
//           padding: 16px;
//         "
//       >
//         <app-masthead></app-masthead>
//       </div>
//     `,
//   }),
// };

// Узкий вьюпорт (демо адаптива)
// export const NarrowContainer: Story = {
//   parameters: {
//     viewport: { defaultViewport: 'responsive' },
//   },
//   render: (args) => ({
//     props: args,
//     template: `
//       <div
//         style="
//           --masthead-gradient: ${args.gradient};
//           --masthead-text: ${args.textColor};
//           --masthead-effect: ${args.effectColor};
//           --masthead-attention: ${args.attentionColor};
//           padding: 16px;
//         "
//       >
//         <div style="max-width: 520px; margin: 0 auto; border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; overflow: hidden;">
//           <app-masthead></app-masthead>
//         </div>
//       </div>
//     `,
//   }),
// };
