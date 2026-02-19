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
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Button variant="primary">Get Started</Button>
    </div>
  ),
};

export const PrimaryDisabled: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Button variant="primary" disabled>Get Started</Button>
    </div>
  ),
};

export const Secondary: Story = {
  render: () => <Button variant="secondary">Submit Selection</Button>,
};

export const SecondaryDisabled: Story = {
  render: () => <Button variant="secondary" disabled>Submit Selection</Button>,
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Button variant="primary">Get Started</Button>
      <Button variant="primary" disabled>Get Started (Disabled)</Button>
      <Button variant="secondary">Submit Selection</Button>
      <Button variant="secondary" disabled>Submit Selection (Disabled)</Button>
    </div>
  ),
};
