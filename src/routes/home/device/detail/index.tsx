import { DeviceData } from '@euc-tricorder/adapters';
import { useTelemetry } from '@euc-tricorder/providers';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import styled from 'styled-components/native';

import { DeviceNavigatorProps } from '..';
import { Chart } from '../chart';
import { Alarms } from './alarms';
import { Statistics } from './statistics';

const Container = styled.View``;

const characteristicToTitle: Record<keyof DeviceData, string> = {
  battery: 'Battery',
  current: 'Current',
  speed: 'Speed',
  temperature: 'Temperature',
  voltage: 'Voltage',
} as const;

export const DetailScreen = (props: DeviceNavigatorProps<'Detail'>) => {
  const navigation = useNavigation();
  const { data } = useTelemetry();
  const {
    route: {
      params: { characteristic },
    },
  } = props;

  useEffect(() => {
    navigation.setOptions({
      title: characteristicToTitle[characteristic],
    });
  }, [navigation, characteristic]);

  const characteristicTelemetry = data[characteristic];

  return (
    <Container>
      <Statistics data={characteristicTelemetry} />
      <Chart
        data={characteristicTelemetry}
        style={{ height: 100 }}
        snapshotSize={1000}
      />
      <Alarms />
    </Container>
  );
};
