import { adapters } from '@euc-tricorder/adapters';
import { CustomNavigatorProps } from '@euc-tricorder/types';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  FlicClientProvider,
  PebbleClientProvider,
  useAdapter,
  useBle,
  useSettings,
} from '../../providers';
import { CrossroadNavigatorProps, Stack as CrossroadStack } from '../crossroad';
import { DeviceScreen } from './device';
import { SettingsScreen } from './settings';

export type Stack = {
  Device: {};
  Settings: {};
};

export type HomeNavigatorProps<P extends keyof Stack> = CustomNavigatorProps<
  BottomTabNavigationProp<Stack & CrossroadStack>,
  Stack & CrossroadStack,
  P
>;

const Tab = createBottomTabNavigator<Stack>();

export const Home = ({ route }: CrossroadNavigatorProps<'Home'>) => {
  const { setAdapter, adapter } = useAdapter();
  const { removeSettingsForKey } = useSettings();
  const { state, manager } = useBle();

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

  useEffect(() => {
    console.log('attempt to auto-connect');
    let timeout: ReturnType<typeof setTimeout>;

    if (state === 'PoweredOn' && !adapter) {
      if (!device) {
        console.log("device hasn't been provided to this screen");
        return;
      }

      console.log('auto-connecting');
      const adapterFactory = adapters.find(
        ({ adapterName }) => adapterName === device.adapter,
      );

      if (!adapterFactory) {
        console.log('remembered adapter not found');
        removeSettingsForKey('device');
        return;
      }

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
              const configuredAdapter = adapterFactory(bleDevice);

              configuredAdapter.connect(handleDisconnect);

              setAdapter(configuredAdapter);

              manager.stopDeviceScan();
            }
          }),
        1000,
      );
    }

    return () => {
      manager.stopDeviceScan();
      timeout && clearTimeout(timeout);
    };
  }, [
    adapter,
    manager,
    state,
    setAdapter,
    handleDisconnect,
    device,
    removeSettingsForKey,
  ]);

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
