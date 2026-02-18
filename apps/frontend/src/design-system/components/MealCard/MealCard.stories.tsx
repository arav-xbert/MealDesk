import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { MealCard } from './MealCard';

const meta = {
  title: 'Design System/Components/MealCard',
  component: MealCard,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
} satisfies Meta<typeof MealCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Grilled Chicken Bowl',
    description: 'Tender grilled chicken served with jasmine rice, steamed broccoli, and teriyaki glaze.',
    tags: ['High Protein', 'Gluten-Free'],
    selected: false,
    onSelect: fn(),
  },
};
