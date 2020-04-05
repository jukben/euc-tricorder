import { DeviceData, readableDeviceDataKeys } from '@euc-tricorder/adapters';
import { useAdapter, useAlarm } from '@euc-tricorder/providers';
import { useCallback, useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import Tts from 'react-native-tts';

/**
 * Alarms are cached. Eg. if you have warning at 20 Km/h you will get
 * warning at 20 Km/h and to trigger it again, it you will need
 * to decelerate to 17 (20 - THRESHOLD) again.
 */
const cachedValues = new Map<string, number>();

const THRESHOLD = 3;

const checkAlarms = ({
  telemetry,
  alarmConfiguration,
  action,
}: {
  telemetry: DeviceData;
  alarmConfiguration: ReturnType<typeof useAlarm>['data'];
  action: (readableCharacteristic: string, value: number) => void;
}) => {
  const characteristics = Object.keys(telemetry) as Array<
    keyof typeof telemetry
  >;

  characteristics.forEach((characteristic) => {
    const value = telemetry[characteristic];

    if (value === undefined || value == null) {
      return;
    }

    const alarms = alarmConfiguration.list[characteristic].map(
      (id) => alarmConfiguration.alarm[id],
    );

    if (!alarms.length) {
      return;
    }

    alarms.forEach(({ id, direction, value: watchedValue }) => {
      const cachedValueForCharacteristic = cachedValues.get(id);

      const shouldClean = cachedValueForCharacteristic
        ? direction === 'up'
          ? value < cachedValueForCharacteristic - THRESHOLD
          : value > cachedValueForCharacteristic + THRESHOLD
        : false;

      const shouldTrigger =
        direction === 'up' ? value > watchedValue : value < watchedValue;

      if (cachedValueForCharacteristic && shouldClean) {
        cachedValues.delete(id);
      }

      if (cachedValueForCharacteristic) {
        return;
      }

      if (shouldTrigger) {
        action(readableDeviceDataKeys[characteristic], value);
        cachedValues.set(id, value);
      }
    });
  });
};

export const Alarms = () => {
  const { adapter } = useAdapter();
  const { data: alarmConfiguration } = useAlarm();
  const lastTimeSpeak = useRef(Date.now());

  const action = useCallback(
    (readableCharacteristic: string, value: number) => {
      const currentTime = Date.now();
      if (currentTime - lastTimeSpeak.current > 5000) {
        Tts.speak(
          `Watch out! ${readableCharacteristic} is ${Math.round(value)}.`,
        );
        Vibration.vibrate([1000, 1000]);
        lastTimeSpeak.current = currentTime;
      }
    },
    [],
  );

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData((telemetry) =>
      checkAlarms({ telemetry, alarmConfiguration, action }),
    );

    return unsubscribe;
  }, [action, adapter, alarmConfiguration]);

  return null;
};
