import React, { useEffect, useCallback } from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAdapter, useBle } from '../../providers';
import { getDevice } from '../../utils';
import { adapters } from '../../adapters';

import { Device } from './device';
import { Settings } from './settings';
import { CustomNavigatorProps } from '../../types';

type Stack = {
  Device: {};
  Settings: {};
};

export type NavigatorProps<P extends keyof Stack> = CustomNavigatorProps<
  BottomTabNavigationProp<Stack>,
  Stack,
  P
>;

const Tab = createBottomTabNavigator<Stack>();

export const Home = () => {
  const { setAdapter, adapter } = useAdapter();
  const bleApi = useBle();

  const autoConnect = useCallback(async () => {
    console.log('autoconnect');
    const device = await getDevice();

    if (!device) {
      console.error('device not remembered');
      return;
    }

    console.log(device.id, device.adapter);

    const adapterFactory = adapters.find(a => a.adapterName === device.adapter);

    if (!adapterFactory) {
      // TODO clean the remembered device
      console.error('adapter not found remembered');
      return;
    }

    bleApi.manager.startDeviceScan(null, null, (error, bleDevice) => {
      if (error) {
        console.error(error);
        return;
      }

      if (bleDevice && bleDevice.id === device.id) {
        setAdapter(adapterFactory(bleDevice, bleApi));
        bleApi.manager.stopDeviceScan();
      }
    });
  }, [bleApi, setAdapter]);

  useEffect(() => {
    console.log(bleApi.state, adapter);
    if (bleApi.state === 'PoweredOn' && !adapter) {
      autoConnect();
    }
  }, [bleApi, autoConnect, adapter]);

  return (
    <Tab.Navigator initialRouteName={'Device'}>
      <Tab.Screen
        name="Device"
        component={Device}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name={'speedometer'} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name={'settings'} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
