import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter, useTelemetry } from '@euc-tricorder/providers';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Chart } from '../chart';

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

type Props = {
  Icon: () => React.ReactElement;
  description: string;
  name: keyof DeviceData;
  onPress: () => void;
};

const initialValue = 0;

export const Characteristic = ({ Icon, description, onPress, name }: Props) => {
  const { data } = useTelemetry();

  const [value, setValue] = useState(initialValue);

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

  const characteristicTelemetry = data[name];

  return (
    <>
      <Container>
        <TouchableOpacity onPress={onPress}>
          <Section>
            <Header>
              <Icon />
              <SubHeader>{description}</SubHeader>
            </Header>
            <Value>{Math.round(value)}</Value>
            <Chart data={characteristicTelemetry} style={{ flex: 3 }} />
          </Section>
        </TouchableOpacity>
      </Container>
    </>
  );
};
