import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Design System/Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'password'] },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextField: Story = {
  args: { variant: 'text', placeholder: 'Enter your email' },
};

export const PasswordField: Story = {
  args: { variant: 'password', placeholder: 'Enter password' },
};
