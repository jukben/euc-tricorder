import { NavigationNativeContainer } from '@react-navigation/native';
import React from 'react';
import Config from 'react-native-config';
import { Provider as PaperProvider } from 'react-native-paper';

import { default as Storybook } from '../storybook';
import { Crossroad } from './Crossroad';
import { AdapterProvider, BleProvider } from './providers';
import { SettingsProvider } from './providers/settings';

const STORYBOOK = Config.STORYBOOK === 'true';

export const App = () => {
  return STORYBOOK ? (
    <Storybook />
  ) : (
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
};
