import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { List } from 'react-native-paper';
import { BleManager, Device } from 'react-native-ble-plx';
import { ExtractParameterType } from '../../../types';
import { useBle } from '../../../providers';
import { NavigatorProps } from '../';

export const Search = ({ navigation }: NavigatorProps<'Search'>) => {
  const [loading, setLoading] = useState(true);
  const { manager } = useBle();
  const DevicesMapRef = useRef<Map<Device['id'], Device>>(new Map());
  const [devices, setDevices] = useState<Array<Device>>([]);

  useEffect(() => {
    manager.onStateChange(newState => {
      if (newState === 'PoweredOn') {
        manager.startDeviceScan(null, null, handleListener);
        setLoading(false);
      } else {
        manager.stopDeviceScan();
        setLoading(true);
      }
    });
  }, [manager]);

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
      {loading && <ActivityIndicator />}
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
