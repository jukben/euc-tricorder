import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Speedometer } from './speedometer';
import { useAdapter, useBle } from '../../../providers';
import { getDevice } from '../../../utils';

export const Device = () => {
  const { adapter, setAdapter } = useAdapter();
  const bleApi = useBle();

  const autoConnect = async () => {
    const device = await getDevice();
    if (!device) {
      console.error('device not remembered');
    }

    console.log('pripojit k device');
  };

  useEffect(() => {
    autoConnect();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Speedometer />
    </View>
  );
};
