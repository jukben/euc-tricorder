import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useAdapter } from '../../../providers';

export const Thermometer = () => {
  const [temperature, setTemperature] = useState<string | null>(null);

  const { adapter } = useAdapter();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const id = adapter.addListener(({ temperature: t }) => {
      setTemperature(t);
    });

    return () => adapter.removeListener(id);
  }, [adapter]);

  return <Text>temperature: {temperature ? temperature : '?'}</Text>;
};
