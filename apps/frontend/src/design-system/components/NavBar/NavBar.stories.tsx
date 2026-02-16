import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from './NavBar';
import { Logo } from '../Logo';
import { Button } from '../Button';

const meta = {
  title: 'Design System/Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  name: 'Title Only',
  args: { title: 'MealDesk' },
};

export const WithLogo: Story = {
  name: 'With Logo',
  args: {
    title: 'MealDesk',
    left: <Logo size={36} />,
  },
};

export const WithActions: Story = {
  name: 'With Actions',
  args: {
    title: 'MealDesk',
    left: <Logo size={36} />,
    right: <Button variant="secondary">Sign In</Button>,
  },
};

export const NoTitle: Story = {
  name: 'No Title',
  args: {
    left: <Logo size={36} />,
    right: <Button variant="secondary">Sign In</Button>,
  },
};
