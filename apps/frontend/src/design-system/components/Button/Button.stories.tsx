import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Design System/Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Get Started' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const PrimaryDisabled: Story = {
  name: 'Primary — Disabled',
  args: { variant: 'primary', children: 'Get Started', disabled: true },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
