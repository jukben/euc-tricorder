import { adapters } from '@euc-tricorder/adapters';
import { useDeviceScan } from '@euc-tricorder/core/shared';
import { CustomNavigatorProps } from '@euc-tricorder/types';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect } from 'react';
import { Device } from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  FlicClientProvider,
  PebbleClientProvider,
  useAdapter,
  useBle,
} from '../../providers';
import { CrossroadNavigatorProps, Stack as CrossroadStack } from '../crossroad';
import { DeviceScreen } from './device';
import { SettingsScreen } from './settings';

export type HomeStack = {
  Device: {};
  Settings: {};
};

export type HomeNavigatorProps<
  P extends keyof HomeStack
> = CustomNavigatorProps<HomeStack & CrossroadStack, P>;

const Tab = createBottomTabNavigator<HomeStack>();

export const Home = ({ route }: CrossroadNavigatorProps<'Home'>) => {
  const { setAdapter } = useAdapter();
  const { registerRestoreStateListener } = useBle();

  const {
    params: { device },
  } = route;

  const handleDisconnect = useCallback(() => {
    PushNotificationIOS.presentLocalNotification({
      alertBody: 'Disconnected from the device',
      alertAction: 'view',
    });
    setAdapter(null);
  }, [setAdapter]);

  const connectToDevice = useCallback(
    async (bleDevice: Device) => {
      const adapterFactory = adapters.find(
        ({ adapterName }) => adapterName === device.adapter,
      );

      if (!adapterFactory) {
        return;
      }

      const configuredAdapter = adapterFactory(bleDevice);
      await configuredAdapter.connect(handleDisconnect);
      setAdapter(configuredAdapter);
    },
    [device.adapter, handleDisconnect, setAdapter],
  );

  const onDeviceFound = useCallback(
    (bleDevice: Device) => {
      if (bleDevice.id === device.id) {
        connectToDevice(bleDevice);
        console.log('...connected!');
      }
    },
    [connectToDevice, device.id],
  );

  useDeviceScan({
    onDeviceFound,
  });

  useEffect(() => {
    const unsubscribe = registerRestoreStateListener((restoredState) => {
      console.log('...restoring connection...');

      const bleDevice = restoredState.connectedPeripherals.find(
        ({ id }) => id === device.id,
      );

      if (!bleDevice) {
        return;
      }

      connectToDevice(bleDevice);
      console.log('...connected!');
    });

    return unsubscribe;
  }, [device.id, connectToDevice, registerRestoreStateListener]);

  return (
    <PebbleClientProvider>
      <FlicClientProvider>
        <Tab.Navigator initialRouteName={'Device'}>
          <Tab.Screen
            name="Device"
            component={DeviceScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name={'speedometer'} color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name={'settings'} color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </FlicClientProvider>
    </PebbleClientProvider>
  );
};
