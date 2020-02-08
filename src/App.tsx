import { NavigationNativeContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { Crossroad } from './Crossroad';
import { AdapterProvider, BleProvider } from './providers';
import { SettingsProvider } from './providers/settings';

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
