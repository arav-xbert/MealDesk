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

export const Text: Story = {
  args: { variant: 'text', placeholder: 'Enter your email' },
};

export const Password: Story = {
  args: { variant: 'password', placeholder: 'Enter password' },
};

export const Disabled: Story = {
  args: { variant: 'text', placeholder: 'Disabled input', disabled: true },
};

export const WithValue: Story = {
  name: 'With Value',
  args: { variant: 'text', defaultValue: 'john@example.com' },
};
