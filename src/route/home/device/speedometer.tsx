import React, { useState, useEffect, useCallback } from 'react';
import { Text } from 'react-native';
import { useAdapter } from '../../../providers';

export const Speedometer = () => {
  const [speed, setSpeed] = useState(0);

  const { adapter } = useAdapter();

  const watchSpeed = useCallback(async () => {
    if (!adapter) {
      return;
    }

    if (!(await adapter.isConnected())) {
      console.log('Not connected');
    }

    adapter.addListener(({ speed: s }) => {
      setSpeed(s);
    });
  }, [adapter]);

  useEffect(() => {
    watchSpeed();
  }, [watchSpeed]);

  return <Text>Speedometer: {speed}</Text>;
};
