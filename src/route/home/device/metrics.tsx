import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration } from 'react-native';

import Tts from 'react-native-tts';
import { useAdapter } from '../../../providers';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeviceData } from '../../../adapters';
import { useAlarm } from './alarm.hook';
import { sendUpdate } from '../../../pebble-client';

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

const voiceInfo = (what: number) => {
  Tts.speak(`Speed: ${what}`);
  Vibration.vibrate(1000);
};

const updatePebbleSpeed = (speed: number) => {
  sendUpdate(Math.round(speed));
};

const useThrottle = ({ callback, threshold = 1000, value }) => {
  const oldDate = useRef(Date.now());

  useEffect(() => {
    const curr = Date.now();
    if (curr - oldDate.current > threshold) {
      callback(value);
      oldDate.current = Date.now();
    }
  }, [value, callback, threshold]);
};

export const Metrics = () => {
  const [data, setData] = useState<DeviceData>({
    speed: 0,
    battery: 0,
    current: 0,
    temperature: 0,
    voltage: 0,
  });

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

  useAlarm({ what: data.speed, when: 30, action: voiceInfo });

  useAlarm({ what: data.speed, when: 40, action: voiceInfo });

  useThrottle({ callback: updatePebbleSpeed, value: data.speed });

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
