import type { Meta, StoryObj } from '@storybook/react';
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
  },
};

export const WithImage: Story = {
  name: 'With Image',
  args: {
    name: 'Mediterranean Salad',
    description: 'Fresh mixed greens with feta, olives, and lemon vinaigrette.',
    tags: ['Vegetarian'],
    image: 'https://placehold.co/400x200/EBE4FF/7949FF?text=Meal+Photo',
  },
};

export const NoDescription: Story = {
  name: 'No Description',
  args: {
    name: 'Chef Special',
    tags: ['Limited'],
  },
};

export const NoTags: Story = {
  name: 'No Tags',
  args: {
    name: 'Classic Burger',
    description: 'Angus beef patty with lettuce, tomato, and special sauce.',
  },
};

export const Minimal: Story = {
  args: {
    name: 'Daily Special',
  },
};
