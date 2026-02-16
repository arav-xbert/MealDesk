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

export const ThreeTabs: Story = {
  name: 'Three Tabs',
  render: () => (
    <TabBar>
      <TabItem active>This Week</TabItem>
      <TabItem>Next Week</TabItem>
      <TabItem>Archive</TabItem>
    </TabBar>
  ),
};

export const SecondTabActive: Story = {
  name: 'Second Tab Active',
  render: () => (
    <TabBar>
      <TabItem>All Meals</TabItem>
      <TabItem active>Upcoming</TabItem>
    </TabBar>
  ),
};
