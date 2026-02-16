import type { Meta, StoryObj } from '@storybook/react';
import { MealScheduleCard } from './MealScheduleCard';

const meta = {
  title: 'Design System/Components/MealScheduleCard',
  component: MealScheduleCard,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
  argTypes: {
    status: { control: 'select', options: ['OPEN', 'CLOSED', 'PENDING', undefined] },
  },
} satisfies Meta<typeof MealScheduleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { day: 'Monday', date: 'Feb 17', mealName: 'Grilled Chicken Bowl', status: 'OPEN' },
};

export const Pending: Story = {
  args: { day: 'Tuesday', date: 'Feb 18', mealName: 'Pasta Primavera', status: 'PENDING' },
};

export const Closed: Story = {
  args: { day: 'Wednesday', date: 'Feb 19', mealName: 'Fish Tacos', status: 'CLOSED' },
};

export const NoStatus: Story = {
  name: 'No Status',
  args: { day: 'Thursday', date: 'Feb 20', mealName: 'TBD' },
};

export const WeekSchedule: Story = {
  name: 'Week Schedule',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <MealScheduleCard day="Monday" date="Feb 17" mealName="Grilled Chicken Bowl" status="OPEN" />
      <MealScheduleCard day="Tuesday" date="Feb 18" mealName="Pasta Primavera" status="OPEN" />
      <MealScheduleCard day="Wednesday" date="Feb 19" mealName="Fish Tacos" status="PENDING" />
      <MealScheduleCard day="Thursday" date="Feb 20" mealName="Caesar Salad" status="CLOSED" />
      <MealScheduleCard day="Friday" date="Feb 21" mealName="TBD" />
    </div>
  ),
};
