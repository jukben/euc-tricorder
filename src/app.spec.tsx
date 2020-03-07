import { render } from '@testing-library/react-native';
import React from 'react';

import { App } from './app';

jest.mock('./providers/pebble-client.tsx');
jest.mock('./providers/flic-client.tsx');
jest.mock('./core/environment.ts');

it('can render main component without error', async () => {
  render(<App />);
});
