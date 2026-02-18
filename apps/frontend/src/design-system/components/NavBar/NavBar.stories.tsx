import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from './NavBar';
import { Logo } from '../Logo';
import { ButtonSecondary } from '../Button';

const meta = {
  title: 'Design System/Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavBar
      title="MealDesk"
      left={<Logo size={56} />}
      right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Aravind</span>
          <ButtonSecondary>Log Out</ButtonSecondary>
        </div>
      }
    />
  ),
};
