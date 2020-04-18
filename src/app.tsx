import { AdapterProvider, BleProvider } from '@euc-tricorder/providers';
import { SettingsProvider } from '@euc-tricorder/providers/settings';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { Crossroad } from './routes/crossroad';

export const App = () => (
  <NavigationContainer>
    <SettingsProvider>
      <BleProvider>
        <AdapterProvider>
          <Crossroad />
        </AdapterProvider>
      </BleProvider>
    </SettingsProvider>
  </NavigationContainer>
);
