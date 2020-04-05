import { BLE_MOCK } from '@euc-tricorder/core';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BleManager, BleRestoredState, State } from 'react-native-ble-plx';

import { BleManagerMock } from './mock';

export type BleAPI = {
  manager: BleManager;
  state: State;
  registerRestoreStateListener: (listener: Listener) => () => void;
};

const BleContext = React.createContext<BleAPI>({
  manager: (null as unknown) as BleManager,
  state: 'Unknown' as State,
  registerRestoreStateListener: () => () => undefined,
});

type Listener = (restoredState: BleRestoredState) => void;

export const useBle = () => useContext(BleContext);

export const BleProvider: React.FC = ({ children }) => {
  const listeners = useRef<Array<Listener | undefined>>([]);

  const bleManagerRef = useRef<BleManager>(
    BLE_MOCK
      ? ((BleManagerMock() as unknown) as BleManager)
      : new BleManager({
          restoreStateIdentifier: 'org.jukben.euctricorder',
          restoreStateFunction: (restoredState) => {
            if (!restoredState) {
              return;
            }

            console.log('BleProvider has restored state', restoredState);
            listeners.current.forEach((listener) => {
              listener && listener(restoredState);
            });
          },
        }),
  );

  /**
   * TODO rewrite this to reuse deleted ids.
   * Maybe it would be good to create some abstraction for it since I use
   * it on multiple places.
   */
  const registerRestoreStateListener = useCallback((listener: Listener) => {
    const id = listeners.current.push(listener) - 1;

    return () => {
      delete listeners.current[id];
    };
  }, []);

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
      registerRestoreStateListener,
    }),
    [registerRestoreStateListener, state],
  );

  return <BleContext.Provider value={api}>{children}</BleContext.Provider>;
};
