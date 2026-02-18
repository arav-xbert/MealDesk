import type { Meta, StoryObj } from '@storybook/react';
import { TabBar, TabItem } from './Tab';

const meta = {
  title: 'Design System/Components/TabBar',
  component: TabBar,
  tags: ['autodocs'],
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TabBar>
      <TabItem active>All Meals</TabItem>
      <TabItem>Upcoming</TabItem>
    </TabBar>
  ),
};
