import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const useThrottle = <T extends unknown>({
  callback,
  value,
  threshold = 5000,
}: {
  callback: (value: T) => void;
  value: T;
  threshold?: number;
}) => {
  const oldDate = useRef(Date.now());

  useEffect(() => {
    const curr = Date.now();
    if (curr - oldDate.current > threshold) {
      callback(value);
      oldDate.current = Date.now();
    }
  }, [value, callback, threshold]);
};

const useAlarm = <T extends unknown>({
  what,
  when,
  action,
}: {
  what: T;
  when: number;
  action: (value: T) => void;
}) => {
  const [paused, setPause] = useState(false);

  const callback = useCallback(
    value => {
      if (paused && value < when) {
        return;
      }

      action(value);
      setPause(false);
    },
    [paused, action, when],
  );

  useEffect(() => {
    let id: number;
    if (paused) {
      id = setTimeout(() => setPause(false), 5000);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [paused]);

  useThrottle<T>({ callback: callback, value: what });
};

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
