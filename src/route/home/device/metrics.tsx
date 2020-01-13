import React, { useState, useEffect } from 'react';
import Tts from 'react-native-tts';
import { useAdapter } from '../../../providers';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeviceData } from '../../../adapters';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  font-size: 40px;
`;

export const Metrics = () => {
  const [data, setData] = useState<DeviceData | null>(null);
  const [maxSpeed, setMaxSpeed] = useState(0);

  const { adapter } = useAdapter();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const id = adapter.addListener(d => {
      setData(d);

      if (d.speed > maxSpeed) {
        setMaxSpeed(d.speed);
      }
    });

    return () => adapter.removeListener(id);
  }, [adapter, maxSpeed]);

  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     Tts.speak(`speed: ${maxSpeed}`);
  //   }, 5000);

  //   return () => clearTimeout(timerId);
  // }, [maxSpeed]);

  if (!data) {
    return null;
  }

  const { battery, speed, temperature, voltage } = data;

  return (
    <Container>
      <Row>
        <Icon name="thermometer" size={40} />
        <Text>{temperature || '?'} °C</Text>
      </Row>
      <Row>
        <Icon name="battery-50" size={40} />
        <Text>{Math.round(battery)} %</Text>
      </Row>
      <Row>
        <Icon name="speedometer" size={40} />
        <Text>
          {speed} ({maxSpeed}) km/h
        </Text>
      </Row>
      <Row>
        <Icon name="alert" size={40} />
        <Text>{voltage || '?'} V</Text>
      </Row>
    </Container>
  );
};
