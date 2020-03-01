import { BLE_MOCK } from '@euc-tricorder/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BleManager, State } from 'react-native-ble-plx';

import { BleManagerMock } from './mock';

const BleAPI = {
  manager: (null as unknown) as BleManager,
  state: 'Unknown' as State,
};

export type BleAPI = typeof BleAPI;

const BleContext = React.createContext<BleAPI>(BleAPI);

export const useBle = () => useContext(BleContext);

export const BleProvider: React.FC = ({ children }) => {
  const bleManagerRef = useRef<BleManager>(
    BLE_MOCK
      ? ((BleManagerMock() as unknown) as BleManager)
      : new BleManager({
          restoreStateIdentifier: 'org.jukben.euctricorder',
          restoreStateFunction: restoredState =>
            restoredState &&
            console.log('BleProvider: restored state', restoredState),
        }),
  );

  const [state, setState] = useState<State>('Unknown' as State);

  useEffect(() => {
    const subscription = bleManagerRef.current.onStateChange(newState => {
      if (newState === state) {
        return;
      }

      setState(newState);
    });

    return () => subscription.remove();
  }, [state]);

  const api = useMemo(() => ({ manager: bleManagerRef.current, state }), [
    state,
  ]);

  return <BleContext.Provider value={api}>{children}</BleContext.Provider>;
};
