import { readableDeviceDataKeys } from '@euc-tricorder/adapters';
import { useTelemetry } from '@euc-tricorder/providers';
import React, { useEffect } from 'react';
import styled from 'styled-components/native';

import { DeviceNavigatorProps } from '..';
import { Chart } from '../chart';
import { Alarms } from './alarms';
import { Statistics } from './statistics';

const Container = styled.View``;

export const DetailScreen = (props: DeviceNavigatorProps<'Detail'>) => {
  const { data } = useTelemetry();
  const {
    route: {
      params: { characteristic },
    },
    navigation,
  } = props;

  useEffect(() => {
    navigation.setOptions({
      title: readableDeviceDataKeys[characteristic],
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
      <Alarms characteristic={characteristic} />
    </Container>
  );
};
