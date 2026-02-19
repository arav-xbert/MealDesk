import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Design System/Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['open', 'pending', 'closed'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { variant: 'open', children: 'OPEN' },
};

export const Pending: Story = {
  args: { variant: 'pending', children: 'PENDING' },
};

export const Closed: Story = {
  args: { variant: 'closed', children: 'CLOSED' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge variant="open">OPEN</Badge>
      <Badge variant="pending">PENDING</Badge>
      <Badge variant="closed">CLOSED</Badge>
    </div>
  ),
};
