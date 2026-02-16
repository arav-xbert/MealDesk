import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Design System/Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['status', 'tag'] },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Status: Story = {
  args: { variant: 'status', children: 'OPEN' },
};

export const Tag: Story = {
  args: { variant: 'tag', children: 'Vegetarian' },
};

export const StatusClosed: Story = {
  name: 'Status — Closed',
  args: { variant: 'status', children: 'CLOSED' },
};

export const StatusPending: Story = {
  name: 'Status — Pending',
  args: { variant: 'status', children: 'PENDING' },
};

export const TagVariants: Story = {
  name: 'Tag Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge variant="tag">Vegetarian</Badge>
      <Badge variant="tag">Gluten-Free</Badge>
      <Badge variant="tag">Spicy</Badge>
      <Badge variant="tag">Dairy-Free</Badge>
    </div>
  ),
};
