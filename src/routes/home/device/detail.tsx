import { DeviceData } from '@euc-tricorder/adapters';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

import { DeviceNavigatorProps } from '.';

const characteristicToTitle: Record<keyof DeviceData, string> = {
  battery: 'Battery',
  current: 'Current',
  speed: 'Speed',
  temperature: 'Temperature',
  voltage: 'Voltage',
} as const;

export const DetailScreen = (props: DeviceNavigatorProps<'Detail'>) => {
  const navigation = useNavigation();
  const {
    route: {
      params: { characteristic },
    },
  } = props;

  useEffect(() => {
    console.log(props);
    navigation.setOptions({ title: characteristicToTitle[characteristic] });
  }, [characteristic, navigation, props]);

  return <Text>Nothing here for now</Text>;
};
