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

  useThrottle({
    callback: (d) => {
      sendUpdate({
        speed: d.speed ? Math.round(d.speed) : undefined,
        battery: d.battery ? Math.round(d.battery) : undefined,
        temperature: d.temperature ? Math.round(d.temperature) : undefined,
        voltage: d.voltage ? Math.round(d.voltage) : undefined,
      });
    },
    value: data,
    threshold: 1000,
  });

  return null;
};
