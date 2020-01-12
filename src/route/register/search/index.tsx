import React, { useRef, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { BleManager, Device } from 'react-native-ble-plx';
import { ExtractParameterType } from '../../../types';
import { useBle } from '../../../providers';
import { RegisterNavigatorProps } from '../';

export const Search = ({ navigation }: RegisterNavigatorProps<'Search'>) => {
  const { manager, state } = useBle();
  const DevicesMapRef = useRef<Map<Device['id'], Device>>(new Map());
  const [devices, setDevices] = useState<Array<Device>>([]);

  useEffect(() => {
    if (state === 'PoweredOn') {
      manager.startDeviceScan(null, null, handleListener);
    }

    return () => manager.stopDeviceScan();
  }, [manager, state]);

  const handleListener: ExtractParameterType<
    BleManager['startDeviceScan'],
    2
  > = (error, device) => {
    if (error) {
      console.error(error);
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
