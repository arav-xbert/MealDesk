import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo';

const meta = {
  title: 'Design System/Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 24, max: 128, step: 8 } },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 56 },
};

export const Small: Story = {
  args: { size: 32 },
};

export const Large: Story = {
  args: { size: 96 },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Logo size={24} />
      <Logo size={32} />
      <Logo size={48} />
      <Logo size={56} />
      <Logo size={72} />
      <Logo size={96} />
    </div>
  ),
};
