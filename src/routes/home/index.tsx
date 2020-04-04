import { adapters } from '@euc-tricorder/adapters';
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
  const { setAdapter, adapter } = useAdapter();
  const { state, manager, registerRestoreStateListener } = useBle();

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
    (bleDevice: Device) => {
      const adapterFactory = adapters.find(
        ({ adapterName }) => adapterName === device.adapter,
      );

      if (!adapterFactory) {
        return;
      }

      const configuredAdapter = adapterFactory(bleDevice);
      configuredAdapter.connect(handleDisconnect);
      setAdapter(configuredAdapter);
    },
    [device.adapter, handleDisconnect, setAdapter],
  );

  useEffect(() => {
    // we are already connected, so no needs to reconnect :)
    if (adapter) {
      return;
    }

    console.log('attempt to auto-connect...');
    let timeout: ReturnType<typeof setTimeout>;

    if (state === 'PoweredOn') {
      console.log('...auto-connecting...');
      /**
       * react-native-ble-plx has some problem if I call startDeviceScan
       * right in the moment Ble is ready (weird right?) so let's artificially
       * slow down a bit.
       *
       * This should be considered as hot fix, ideally it should be simply without
       * the timeout.
       */
      timeout = setTimeout(
        () =>
          manager.startDeviceScan(null, null, (error, bleDevice) => {
            if (error) {
              console.log(error);
              return;
            }

            if (bleDevice && bleDevice.id === device.id) {
              connectToDevice(bleDevice);
              console.log('...connected!');
            }
          }),
        1000,
      );
    }

    return () => {
      manager.stopDeviceScan();
      timeout && clearTimeout(timeout);
    };
  }, [adapter, manager, state, connectToDevice, device.id]);

  useEffect(() => {
    const unsubscribe = registerRestoreStateListener((restoredState) => {
      const bleDevice = restoredState.connectedPeripherals.find(
        ({ id }) => id === device.id,
      );

      if (!bleDevice) {
        return;
      }
      connectToDevice(bleDevice);
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
