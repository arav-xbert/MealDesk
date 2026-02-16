import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Design System/Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a basic card with some content inside.',
  },
};

export const WithRichContent: Story = {
  name: 'With Rich Content',
  render: () => (
    <Card>
      <h3 style={{ marginBottom: 8 }}>Card Title</h3>
      <p style={{ marginBottom: 12 }}>Some descriptive text goes here to demonstrate rich content inside a card.</p>
      <button>Action</button>
    </Card>
  ),
};
