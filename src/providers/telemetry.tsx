import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter } from '@euc-tricorder/providers';
import React, { useContext, useEffect, useReducer, useRef } from 'react';

const initialData = {
  speed: [],
  voltage: [],
  current: [],
  temperature: [],
  battery: [],
};

type Data = Record<keyof DeviceData, Array<DeviceData[keyof DeviceData]>>;

export type TelemetryApi = {
  data: Data;
};

const TelemetryContext = React.createContext<TelemetryApi>(
  (null as unknown) as TelemetryApi,
);

export const useTelemetry = () => useContext(TelemetryContext);

type State = { data: Data };

type Action = { type: 'ADD_SNAPSHOT'; snapshot: DeviceData };

const createSnapshotUpdater = ({ data }: State, snapshot: DeviceData) => (
  characteristic: keyof DeviceData,
) => [...data[characteristic], snapshot[characteristic]];

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SNAPSHOT': {
      const { snapshot } = action;

      const updateCharacteristic = createSnapshotUpdater(state, snapshot);

      return {
        ...state,
        data: {
          speed: updateCharacteristic('speed'),
          voltage: updateCharacteristic('voltage'),
          current: updateCharacteristic('current'),
          temperature: updateCharacteristic('temperature'),
          battery: updateCharacteristic('battery'),
        },
      };
    }

    default: {
      return state;
    }
  }
}

const UPDATE_FREQUENCY = 1000; //1s

export const TelemetryProvider: React.FC = ({ children }) => {
  const { adapter } = useAdapter();

  const dataRef = useRef<DeviceData>({
    speed: 0,
    battery: 0,
    current: 0,
    temperature: 0,
    voltage: 0,
  });

  const [state, dispatch] = useReducer(reducer, { data: initialData });

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData(newData => {
      dataRef.current = newData;
    });

    return unsubscribe;
  }, [adapter]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'ADD_SNAPSHOT', snapshot: dataRef.current });
    }, UPDATE_FREQUENCY);

    return () => clearInterval(interval);
  });

  return (
    <TelemetryContext.Provider value={state}>
      {children}
    </TelemetryContext.Provider>
  );
};
