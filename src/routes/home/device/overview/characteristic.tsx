import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter, useTelemetry } from '@euc-tricorder/providers';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
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
  padding-left: 15px;
  font-size: 50px;
`;

const ValueContainer = styled.View`
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

export const Characteristic = ({ Icon, description, onPress, name }: Props) => {
  const { data } = useTelemetry();

  const [value, setValue] = useState<number | null>(null);

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
            {value ? (
              <ValueContainer>
                <Value>{Math.round(value)}</Value>
              </ValueContainer>
            ) : (
              <ValueContainer>
                <ActivityIndicator />
              </ValueContainer>
            )}
            <Chart data={characteristicTelemetry} style={{ flex: 3 }} />
          </Section>
        </TouchableOpacity>
      </Container>
    </>
  );
};
