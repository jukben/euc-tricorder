import { AdapterService } from '@euc-tricorder/adapters';
import { CustomNavigatorProps } from '@euc-tricorder/types';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Device } from 'react-native-ble-plx';

import { Stack as RootStack } from '../crossroad';
import { ConnectScreen } from './connect';
import { PickAdapterScreen } from './pick-adapter';
import { SearchScreen } from './search';

export type RegisterStack = {
  Search: {};
  Connect: { adapter: AdapterService };
  PickAdapter: { device: Device };
};

export type RegisterNavigatorProps<
  P extends keyof RegisterStack
> = CustomNavigatorProps<RegisterStack & RootStack, P>;

const Stack = createStackNavigator<RegisterStack>();

export const Register = () => {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="PickAdapter"
        component={PickAdapterScreen}
        options={{ title: 'Pick an adapter' }}
      />
      <Stack.Screen name="Connect" component={ConnectScreen} />
    </Stack.Navigator>
  );
};
