import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Device } from 'react-native-ble-plx';

import { Search } from './search';
import { PickAdapter } from './pick-adapter';
import { Connect } from './connect';
import { Stack as RootStack } from '../../App';
import { CustomNavigatorProps } from '../../types';

type Stack = {
  Search: {};
  Connect: {};
  PickAdapter: { device: Device };
} & RootStack;

export type NavigatorProps<P extends keyof Stack> = CustomNavigatorProps<
  Stack,
  P
>;

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
