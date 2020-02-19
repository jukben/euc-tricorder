import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { adapters } from '../../adapters';
import { CrossroadNavigatorProps } from '../../crossroad';
import {
  FlicClientProvider,
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
    if (state === 'PoweredOn' && !adapter) {
      if (!device) {
        console.log("device hasn't been provided to this screen");
        return;
      }

      console.log('auto-connect', state);
      const adapterFactory = adapters.find(
        a => a.adapterName === device.adapter,
      );

      if (!adapterFactory) {
        console.log('remembered adapter not found');
        removeSettingsForKey('device');
        return;
      }

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
      });
    }

    return () => manager.stopDeviceScan();
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
      </FlicClientProvider>
    </PebbleClientProvider>
  );
};
