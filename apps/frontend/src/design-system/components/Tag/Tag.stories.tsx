import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta = {
  title: 'Design System/Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'HIGH PROTEIN' },
};

export const MultipleTagsExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Tag>HIGH PROTEIN</Tag>
      <Tag>GLUTEN FREE</Tag>
      <Tag>VEGETARIAN</Tag>
    </div>
  ),
};
