import type { Meta, StoryObj } from '@storybook/react';
import { ButtonPrimary, ButtonSecondary } from './Button';

const meta = {
  title: 'Design System/Components/Button',
  component: ButtonPrimary,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ButtonPrimary>Get Started</ButtonPrimary>
    </div>
  ),
};

export const Secondary: Story = {
  render: () => <ButtonSecondary>Cancel</ButtonSecondary>,
};
