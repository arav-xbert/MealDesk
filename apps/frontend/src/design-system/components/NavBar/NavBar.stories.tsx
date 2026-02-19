import type { Meta, StoryObj } from '@storybook/react';
import { NavBar } from './NavBar';
import { Logo } from '../Logo';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 500, color: '#D9D9E5' }}>Jane Doe</span>
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 400, color: '#A6A6B2', cursor: 'pointer' }}>Logout</span>
        </div>
      }
    />
  ),
};
