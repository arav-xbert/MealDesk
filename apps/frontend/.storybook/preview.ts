import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      values: [
        { name: 'Light', value: '#F5F6F7' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Dark', value: '#1A1A26' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
};

export default preview;
