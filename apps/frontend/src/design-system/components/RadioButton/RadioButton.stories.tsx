import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';

const meta = {
  title: 'Design System/Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { label: 'Option A', name: 'demo' },
};

export const Checked: Story = {
  args: { label: 'Option A', name: 'demo', defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: 'Unavailable', name: 'demo', disabled: true },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <RadioButton label="Small" name="size" value="sm" />
      <RadioButton label="Medium" name="size" value="md" defaultChecked />
      <RadioButton label="Large" name="size" value="lg" />
    </div>
  ),
};
