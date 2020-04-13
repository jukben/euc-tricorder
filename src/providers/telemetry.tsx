import { DeviceData } from '@euc-tricorder/adapters';
import producer from 'immer';
import React, { useContext, useEffect, useReducer, useRef } from 'react';

import { useAdapter } from './adapter';

export type TTelemetryData = Array<{
  value: number;
  isoString: string;
}>;

const initialData = {
  speed: [] as TTelemetryData,
  voltage: [] as TTelemetryData,
  current: [] as TTelemetryData,
  temperature: [] as TTelemetryData,
  battery: [] as TTelemetryData,
  totalDistance: [] as TTelemetryData,
  currentDistance: [] as TTelemetryData,
  deviceUptime: [] as TTelemetryData,
};

type State = typeof initialData;

type Action = { type: 'ADD_SNAPSHOT'; snapshot: DeviceData };

export type TelemetryApi = {
  data: State;
};

const TelemetryContext = React.createContext<TelemetryApi>({
  data: initialData,
});

export const useTelemetry = () => useContext(TelemetryContext);

export function telemetryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SNAPSHOT': {
      const { snapshot } = action;

      return producer(state, (draftState) => {
        ((Object.keys(snapshot) as unknown) as Array<keyof DeviceData>).forEach(
          (characteristic) => {
            const value = snapshot[characteristic];

            if (value !== undefined) {
              draftState[characteristic].push({
                value,
                isoString: new Date().toISOString(),
              });
            }
          },
        );
      });
    }

    default: {
      return state;
    }
  }
}

const UPDATE_FREQUENCY = 1000; //1s

export const TelemetryProvider: React.FC = ({ children }) => {
  const { adapter } = useAdapter();

  const dataRef = useRef<DeviceData | null>(null);

  const [state, dispatch] = useReducer(telemetryReducer, initialData);

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
    const interval = setInterval(() => {
      if (dataRef.current) {
        dispatch({ type: 'ADD_SNAPSHOT', snapshot: dataRef.current });
      }
    }, UPDATE_FREQUENCY);

    return () => clearInterval(interval);
  }, []);

  return (
    <TelemetryContext.Provider value={{ data: state }}>
      {children}
    </TelemetryContext.Provider>
  );
};
