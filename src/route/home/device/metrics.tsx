import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Vibration } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

import { DeviceData } from '../../../adapters';
import { useAdapter } from '../../../providers';
import { useAlarm } from './alarm.hook';
import { useThrottle } from './throttle.hook';

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

const Section = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d3d3d3;
`;

const Header = styled.View`
  height: 80px;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const Value = styled.Text`
  font-size: 50px;
  padding-left: 15px;
  flex: 1;
`;

const SubHeader = styled.Text`
  font-size: 10px;
`;

const Chart = React.memo(({ data }: { data: Array<number> }) => {
  return (
    <LineChart
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 3 }}
      data={data}
      animate={true}
      svg={{ stroke: 'rgb(134, 65, 244)' }}
      contentInset={{ top: 20, bottom: 20 }}
    />
  );
});

const voiceInfo = (what: number) => {
  Tts.speak(`Speed: ${what}`);
  Vibration.vibrate(1000);
};

// const updatePebbleSpeed = (speed: number) => {
//   sendUpdate(Math.round(speed));
// };

const initData: DeviceData = {
  speed: 0,
  battery: 0,
  current: 0,
  temperature: 0,
  voltage: 0,
};

export const Metrics = () => {
  const [telemetryData, setTelemetryData] = useState<Array<DeviceData>>([]);

  const [data, setData] = useState<DeviceData>(initData);

  const { adapter } = useAdapter();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const id = adapter.addListener(newData => {
      setData(newData);
    });

    return () => adapter.removeListener(id);
  }, [adapter]);

  useAlarm({ what: data.speed, when: 30, action: voiceInfo });

  useAlarm({ what: data.speed, when: 40, action: voiceInfo });

  const performStateSnapshot = useCallback(
    dataSnapshot => {
      setTelemetryData(restSnapshots => [...restSnapshots, dataSnapshot]);
    },
    [setTelemetryData],
  );

  useThrottle({
    callback: performStateSnapshot,
    value: data,
    threshold: 10000,
  });

  const getData = useMemo(() => {
    const SNAPSHOT_SIZE = 600;
    const dataForDimension = telemetryData.reverse().slice(-SNAPSHOT_SIZE);

    const enhancedData = [
      ...(SNAPSHOT_SIZE - dataForDimension.length >= 0
        ? Array.from(
            { length: SNAPSHOT_SIZE - dataForDimension.length },
            () => initData,
          )
        : []),
      ...dataForDimension,
    ];

    const groupByDimension = enhancedData.reduce(
      (acc, v) => {
        acc.speed.push(v.speed);
        acc.voltage.push(v.voltage);
        acc.current.push(v.current);
        acc.temperature.push(v.temperature);
        acc.battery.push(v.battery);
        return acc;
      },
      {
        speed: [],
        current: [],
        temperature: [],
        voltage: [],
        battery: [],
      } as Record<keyof DeviceData, Array<number>>,
    );

    return (dimension: keyof DeviceData) => {
      return groupByDimension[dimension];
    };
  }, [telemetryData]);

  const { battery, speed, temperature, voltage } = data;

  return (
    <Container>
      <Section>
        <Header>
          <Icon name="thermometer" size={40} />
          <SubHeader>°C</SubHeader>
        </Header>
        <Value>{temperature}</Value>
        <Chart data={getData('temperature')} />
      </Section>
      <Section>
        <Header>
          <Icon name="speedometer" size={40} />
          <SubHeader>km/h</SubHeader>
        </Header>
        <Value>{Math.round(speed)}</Value>
        <Chart data={getData('speed')} />
      </Section>
      <Section>
        <Header>
          <Icon name="battery-outline" size={40} />
          <SubHeader>%</SubHeader>
        </Header>
        <Value>{Math.round(battery)}</Value>
        <Chart data={getData('battery')} />
      </Section>
      <Section>
        <Header>
          <Icon name="alert" size={40} />
          <SubHeader>V</SubHeader>
        </Header>
        <Value>{Math.round(voltage)}</Value>
        <Chart data={getData('voltage')} />
      </Section>
    </Container>
  );
};
