import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter, useFlicClient } from '@euc-tricorder/providers';
import { ButtonActionEvent } from '@euc-tricorder/providers/flic-client';
import { useEffect, useRef } from 'react';
import Tts from 'react-native-tts';

const initData: DeviceData = {
  speed: 0,
  battery: 0,
  current: 0,
  temperature: 0,
  voltage: 0,
};

type Props = {
  action: ButtonActionEvent['payload'];
};

export const FlicButton = ({ action }: Props) => {
  const { adapter } = useAdapter();
  const { registerListener } = useFlicClient();
  const dataRef = useRef<DeviceData>(initData);

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData((newData) => {
      dataRef.current = newData;
    });

    return unsubscribe;
  }, [adapter]);

  useEffect(() => {
    const unsubscribe = registerListener((event) => {
      if (event.name === 'ButtonAction' && event.payload === action) {
        const speed = dataRef.current.speed;
        const battery = dataRef.current.battery;
        const temperature = dataRef.current.temperature;

        /**
         * @TODO would be worth it to revisit that Partial type definition for DeviceData
         */
        if (
          speed === undefined ||
          battery === undefined ||
          temperature === undefined
        ) {
          return;
        }

        console.log('Flic action - say key information out loud!');
        Tts.stop();
        Tts.speak(
          `Speed: ${Math.round(speed)} km/h; Battery: ${Math.round(
            battery,
          )}%; Temperature: ${Math.round(temperature)} °C`,
        );
      }
    });

    return unsubscribe;
  }, [action, registerListener]);

  return null;
};
