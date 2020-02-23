import { AdapterService } from '@euc-tricorder/adapters';
import { CustomNavigatorProps } from '@euc-tricorder/types';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { Device } from 'react-native-ble-plx';

import { Stack as RootStack } from '../crossroad';
import { ConnectScreen } from './connect';
import { PickAdapterScreen } from './pick-adapter';
import { SearchScreen } from './search';

type Stack = {
  Search: {};
  Connect: { adapter: AdapterService };
  PickAdapter: { device: Device };
} & RootStack;

export type RegisterNavigatorProps<
  P extends keyof Stack
> = CustomNavigatorProps<StackNavigationProp<Stack>, Stack, P>;

const Stack = createStackNavigator<Stack>();

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
