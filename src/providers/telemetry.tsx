import { DeviceData } from '@euc-tricorder/adapters';
import { useAdapter } from '@euc-tricorder/providers';
import producer from 'immer';
import React, { useContext, useEffect, useReducer, useRef } from 'react';

const initialData = {
  speed: [] as Array<number>,
  voltage: [] as Array<number>,
  current: [] as Array<number>,
  temperature: [] as Array<number>,
  battery: [] as Array<number>,
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

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SNAPSHOT': {
      const { snapshot } = action;

      return producer(state, draftState => {
        ((Object.keys(snapshot) as unknown) as Array<keyof DeviceData>).forEach(
          characteristic => {
            draftState[characteristic].push(snapshot[characteristic]);
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

  const dataRef = useRef<DeviceData>({
    speed: 0,
    battery: 0,
    current: 0,
    temperature: 0,
    voltage: 0,
  });

  const [state, dispatch] = useReducer(reducer, initialData);

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
    <TelemetryContext.Provider value={{ data: state }}>
      {children}
    </TelemetryContext.Provider>
  );
};
