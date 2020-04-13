import { useDeviceScan } from '@euc-tricorder/core/shared';
import React, { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Device } from 'react-native-ble-plx';
import styled from 'styled-components/native';

import { RegisterNavigatorProps } from '..';

const Item = styled.Button``;

export const SearchScreen = ({
  navigation,
}: RegisterNavigatorProps<'Search'>) => {
  const DevicesMapRef = useRef<Map<Device['id'], Device>>(new Map());
  const [devices, setDevices] = useState<Array<Device>>([]);

  useDeviceScan({
    onDeviceFound: (bleDevice) => {
      if (!DevicesMapRef.current.has(bleDevice.id)) {
        DevicesMapRef.current.set(bleDevice.id, bleDevice);
        setDevices((allDevices) => [bleDevice, ...allDevices]);
      }
    },
  });

  const handlePress = (device: Device) => {
    navigation.navigate('PickAdapter', { device });
  };

  return (
    <ScrollView>
      {devices
        .filter((device) => device.name)
        .map((device) => (
          <Item
            key={device.id}
            title={device.name as string}
            onPress={() => handlePress(device)}
          />
        ))}
    </ScrollView>
  );
};
