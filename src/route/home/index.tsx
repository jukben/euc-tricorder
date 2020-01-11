import React from 'react';
import { AdapterProvider } from '../../providers';
import { TNavigatorProps } from '../../../App';
import { ErrorBoundary } from './error-boundary';
import { Monitor } from './monitor';

export const Home = ({ navigation, route }: TNavigatorProps<'Home'>) => {
  const {
    params: { adapter },
  } = route;

  return (
    <AdapterProvider value={adapter}>
      <ErrorBoundary>
        <Monitor />
      </ErrorBoundary>
    </AdapterProvider>
  );
};
