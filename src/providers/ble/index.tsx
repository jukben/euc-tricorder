import { BLE_MOCK } from '@euc-tricorder/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BleManager, State } from 'react-native-ble-plx';

import { BleManagerMock } from './mock';

export type BleAPI = {
  manager: BleManager | null;
  state: State;
};

const BleContext = React.createContext<BleAPI>({
  manager: null,
  state: 'Unknown' as State,
});

export const useBle = () => useContext(BleContext);

export const BleProvider: React.FC = ({ children }) => {
  const bleManagerRef = useRef<BleManager>(
    BLE_MOCK ? ((BleManagerMock() as unknown) as BleManager) : new BleManager(),
  );

  const [state, setState] = useState<State>('Unknown' as State);

  useEffect(() => {
    const subscription = bleManagerRef.current.onStateChange((newState) => {
      setState(newState);
    });

    return () => subscription.remove();
  }, []);

  const api = useMemo(
    () => ({
      manager: bleManagerRef.current,
      state,
    }),
    [state],
  );

  return <BleContext.Provider value={api}>{children}</BleContext.Provider>;
};
