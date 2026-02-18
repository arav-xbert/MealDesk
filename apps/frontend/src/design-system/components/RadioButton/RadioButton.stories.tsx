import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';

const meta = {
  title: 'Design System/Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: { label: 'Option A', name: 'demo' },
};

export const Selected: Story = {
  args: { label: 'Option A', name: 'demo', defaultChecked: true },
};
