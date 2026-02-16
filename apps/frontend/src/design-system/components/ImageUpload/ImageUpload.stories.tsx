import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ImageUpload } from './ImageUpload';

const meta = {
  title: 'Design System/Components/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
  args: {
    onFileSelect: fn(),
  },
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SmallSizeLimit: Story = {
  name: 'Small Size Limit (1 MB)',
  args: { maxSizeMB: 1 },
};

export const CustomAccept: Story = {
  name: 'PNG Only',
  args: { accept: 'image/png' },
};
