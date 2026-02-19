import type { Meta, StoryObj } from "@storybook/react";
import { MealScheduleCard } from "./MealScheduleCard";

const meta = {
  title: "Design System/Components/MealScheduleCard",
  component: MealScheduleCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MealScheduleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    mealName: "Grilled Chicken Bowl",
    date: "Monday, Feb 17",
    deadline: "Order by 10:00 AM",
    status: "open",
  },
};
