import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { adapters } from '../../adapters';
import { CrossroadNavigatorProps } from '../../Crossroad';
import {
  PebbleClientProvider,
  useAdapter,
  useBle,
  useSettings,
} from '../../providers';
import { CustomNavigatorProps } from '../../types';
import { Device } from './device';
import { Settings } from './settings';

type Stack = {
  Device: {};
  Settings: {};
};

export type HomeNavigatorProps<P extends keyof Stack> = CustomNavigatorProps<
  BottomTabNavigationProp<Stack>,
  Stack,
  P
>;

const Tab = createBottomTabNavigator<Stack>();

export const Home = ({ route }: CrossroadNavigatorProps<'Home'>) => {
  const { setAdapter, adapter } = useAdapter();
  const { removeSettingsForKey } = useSettings();
  const bleApi = useBle();

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
    if (bleApi.state === 'PoweredOn' && !adapter) {
      if (!device) {
        console.error("device hasn't been provided to this screen");
        return;
      }

      console.log('auto-connect');
      const adapterFactory = adapters.find(
        a => a.adapterName === device.adapter,
      );

      if (!adapterFactory) {
        console.error('remembered adapter not found');
        removeSettingsForKey('device');
        return;
      }

      bleApi.manager.startDeviceScan(null, null, (error, bleDevice) => {
        if (error) {
          console.error(error);
          return;
        }

        if (bleDevice && bleDevice.id === device.id) {
          const configuredAdapter = adapterFactory(bleDevice);

          configuredAdapter.connect(handleDisconnect);

          setAdapter(configuredAdapter);

          bleApi.manager.stopDeviceScan();
        }
      });
    }

    return () => bleApi.manager.stopDeviceScan();
  }, [
    adapter,
    bleApi,
    setAdapter,
    handleDisconnect,
    device,
    removeSettingsForKey,
  ]);

  return (
    <PebbleClientProvider>
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
    </PebbleClientProvider>
  );
};
