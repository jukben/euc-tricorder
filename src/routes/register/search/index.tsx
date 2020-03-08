import { useBle } from '@euc-tricorder/providers';
import { ExtractParameterType } from '@euc-tricorder/types';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { List } from 'react-native-paper';

import { RegisterNavigatorProps } from '..';

export const SearchScreen = ({
  navigation,
}: RegisterNavigatorProps<'Search'>) => {
  const { manager, state } = useBle();
  const DevicesMapRef = useRef<Map<Device['id'], Device>>(new Map());
  const [devices, setDevices] = useState<Array<Device>>([]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (state === 'PoweredOn') {
      /**
       * react-native-ble-plx has some problem if I call startDeviceScan
       * right in the moment Ble is ready (weird right?) so let's artificially
       * slow down a bit.
       *
       * This should be considered as hot fix, ideally it should be simply without
       * the timeout.
       */
      timeout = setTimeout(
        () => manager.startDeviceScan(null, null, handleListener),
        1000,
      );
    }

    return () => {
      manager.stopDeviceScan();
      timeout && clearTimeout(timeout);
    };
  }, [manager, state]);

  const handleListener: ExtractParameterType<
    BleManager['startDeviceScan'],
    2
  > = (error, device) => {
    if (error) {
      console.log(error);
      return;
    }

    if (!device) {
      return;
    }

    if (!DevicesMapRef.current.has(device.id)) {
      DevicesMapRef.current.set(device.id, device);
      setDevices(allDevices => [device, ...allDevices]);
    }
  };

  const handlePress = (device: Device) => {
    navigation.navigate('PickAdapter', { device });
  };

  return (
    <ScrollView>
      <List.Section>
        {devices
          .filter(device => device.name)
          .map(device => (
            <List.Item
              key={device.id}
              title={device.name}
              onPress={() => handlePress(device)}
            />
          ))}
      </List.Section>
    </ScrollView>
  );
};
