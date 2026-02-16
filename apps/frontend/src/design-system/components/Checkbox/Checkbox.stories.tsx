import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Design System/Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const Checked: Story = {
  args: { label: 'Accept terms and conditions', defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: 'Unavailable option', disabled: true },
};

export const DisabledChecked: Story = {
  name: 'Disabled + Checked',
  args: { label: 'Locked selection', disabled: true, defaultChecked: true },
};

export const NoLabel: Story = {
  name: 'No Label',
  args: {},
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Vegetarian" name="dietary" />
      <Checkbox label="Gluten-Free" name="dietary" />
      <Checkbox label="Dairy-Free" name="dietary" defaultChecked />
    </div>
  ),
};
