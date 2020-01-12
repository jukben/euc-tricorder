import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { Device } from 'react-native-ble-plx';

import { Search } from './search';
import { PickAdapter } from './pick-adapter';
import { Connect } from './connect';
import { Stack as RootStack } from '../../Crossroad';
import { CustomNavigatorProps } from '../../types';

type Stack = {
  Search: {};
  Connect: {};
  PickAdapter: { device: Device };
} & RootStack;

export type RegisterNavigatorProps<
  P extends keyof Stack
> = CustomNavigatorProps<StackNavigationProp<Stack>, Stack, P>;

const Stack = createStackNavigator<Stack>();

export const Register = () => {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen
        name="PickAdapter"
        component={PickAdapter}
        options={{ title: 'Pick an adapter' }}
      />
      <Stack.Screen name="Connect" component={Connect} />
    </Stack.Navigator>
  );
};
