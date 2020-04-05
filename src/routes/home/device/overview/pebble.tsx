import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter, usePebbleClient } from '@euc-tricorder/providers';
import { useCallback, useEffect, useState } from 'react';

import { useThrottle } from '../throttle.hook';

const initData: DeviceData = {
  speed: 0,
  battery: 0,
  current: 0,
  temperature: 0,
  voltage: 0,
};

export const Pebble = () => {
  const [data, setData] = useState<DeviceData>(initData);

  const { adapter } = useAdapter();
  const { sendUpdate } = usePebbleClient();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData((newData) => {
      setData(newData);
    });

    return unsubscribe;
  }, [adapter]);

  const updatePebble = useCallback(
    (d) => {
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

  return null;
};
