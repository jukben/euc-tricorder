import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { BleProvider, AdapterProvider } from './providers';
import { SettingsProvider } from './providers/settings';
import { Crossroad } from './Crossroad';
import { default as Storybook } from '../storybook';

const STORYBOOK = false;

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
