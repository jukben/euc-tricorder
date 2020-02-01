import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Vibration } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

import { DeviceData } from '../../../adapters';
import { useAdapter, useFlicClient, usePebbleClient } from '../../../providers';
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

const initData: DeviceData = {
  speed: 0,
  battery: 0,
  current: 0,
  temperature: 0,
  voltage: 0,
};

export const Metrics = () => {
  const [telemetryData, setTelemetryData] = useState<Array<DeviceData>>([]);
  const { registerListener } = useFlicClient();

  const [data, setData] = useState<DeviceData>(initData);
  // for optimization purposes to avoid re-registering handlers
  const dataRef = useRef<DeviceData>(initData);

  const { adapter } = useAdapter();
  const { sendUpdate } = usePebbleClient();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData(newData => {
      setData(newData);
      dataRef.current = newData;
    });

    return unsubscribe;
  }, [adapter]);

  const performStateSnapshot = useCallback(
    dataSnapshot => {
      setTelemetryData(restSnapshots => [...restSnapshots, dataSnapshot]);
    },
    [setTelemetryData],
  );

  const updatePebble = useCallback(
    d => {
      sendUpdate({
        speed: Math.round(d.speed),
        battery: Math.round(d.battery),
        temperature: Math.round(d.temperature),
        voltage: Math.round(d.voltage),
      });
    },
    [sendUpdate],
  );

  useThrottle({
    callback: updatePebble,
    value: data,
    threshold: 1000,
  });

  useThrottle({
    callback: performStateSnapshot,
    value: data,
    threshold: 5000,
  });

  useAlarm({
    what: data.speed,
    when: 40,
    action: speed => {
      Tts.speak(`Watch out! speed is ${speed} km/h`);
      Vibration.vibrate([1000, 1000]);
    },
  });

  useEffect(() => {
    const unsubscribe = registerListener(event => {
      if (event.name === 'ButtonAction' && event.payload === 'hold') {
        console.log('Flic action - say key information out loud!');
        Tts.speak(
          `Speed: ${Math.round(
            dataRef.current.speed,
          )} km/h; Battery: ${Math.round(
            dataRef.current.battery,
          )}%; Temperature: ${Math.round(dataRef.current.temperature)} °C`,
        );
      }
    });

    return unsubscribe;
  }, [registerListener]);

  const getChartData = useMemo(() => {
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
        <Chart data={getChartData('temperature')} />
      </Section>
      <Section>
        <Header>
          <Icon name="speedometer" size={40} />
          <SubHeader>km/h</SubHeader>
        </Header>
        <Value>{Math.round(speed)}</Value>
        <Chart data={getChartData('speed')} />
      </Section>
      <Section>
        <Header>
          <Icon name="battery-outline" size={40} />
          <SubHeader>%</SubHeader>
        </Header>
        <Value>{Math.round(battery)}</Value>
        <Chart data={getChartData('battery')} />
      </Section>
      <Section>
        <Header>
          <Icon name="alert" size={40} />
          <SubHeader>V</SubHeader>
        </Header>
        <Value>{Math.round(voltage)}</Value>
        <Chart data={getChartData('voltage')} />
      </Section>
    </Container>
  );
};
