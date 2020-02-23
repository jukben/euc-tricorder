import { AdapterProvider, BleProvider } from '@euc-tricorder/providers';
import { SettingsProvider } from '@euc-tricorder/providers/settings';
import { NavigationNativeContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { Crossroad } from './routes/crossroad';

export const App = () => (
  <NavigationNativeContainer>
    <PaperProvider>
      <SettingsProvider>
        <BleProvider>
          <AdapterProvider>
            <Crossroad />
          </AdapterProvider>
        </BleProvider>
      </SettingsProvider>
    </PaperProvider>
  </NavigationNativeContainer>
);
