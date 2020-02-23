import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter } from '@euc-tricorder/providers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-svg-charts';
import styled from 'styled-components/native';

import { useThrottle } from '../throttle.hook';

const Container = styled.View`
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #d3d3d3;
`;

const Section = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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
      animate={false}
      svg={{ stroke: 'rgb(134, 65, 244)' }}
      contentInset={{ top: 20, bottom: 20 }}
    />
  );
});

type Props = {
  Icon: () => React.ReactElement;
  description: string;
  name: keyof DeviceData;
  onPress: () => void;
};

const initialValue = 0;

const SNAPSHOT_SIZE = 600;
const REFRESH_RATE = 1000; // 1s

export const Characteristic = ({ Icon, description, onPress, name }: Props) => {
  const [value, setValue] = useState(initialValue);
  const [telemetryData, setTelemetryData] = useState(() =>
    Array(SNAPSHOT_SIZE).fill(initialValue),
  );

  const { adapter } = useAdapter();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData(newData => {
      const characteristic = newData[name];

      setValue(characteristic);
    });

    return unsubscribe;
  }, [adapter, name]);

  const performStateSnapshot = useCallback(
    dataSnapshot => {
      setTelemetryData(restSnapshots => [...restSnapshots, dataSnapshot]);
    },
    [setTelemetryData],
  );

  useThrottle({
    callback: performStateSnapshot,
    value,
    threshold: REFRESH_RATE,
  });

  const chartData = useMemo(() => {
    const dataSnapshot = telemetryData.slice(-SNAPSHOT_SIZE);

    return dataSnapshot;
  }, [telemetryData]);

  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Section>
          <Header>
            <Icon />
            <SubHeader>{description}</SubHeader>
          </Header>
          <Value>{Math.round(value)}</Value>
          <Chart data={chartData} />
        </Section>
      </TouchableOpacity>
    </Container>
  );
};
