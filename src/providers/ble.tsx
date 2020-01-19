import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BleManager, State } from 'react-native-ble-plx';

const BleAPI = {
  manager: (null as unknown) as BleManager,
  state: 'Unknown' as State,
};

export type BleAPI = typeof BleAPI;

const BleContext = React.createContext<BleAPI>(BleAPI);

export const useBle = () => useContext(BleContext);

export const BleProvider: React.FC = ({ children }) => {
  const bleManagerRef = useRef<BleManager>(
    new BleManager({
      restoreStateIdentifier: 'eucmonitor',
      restoreStateFunction: restoredState =>
        restoredState && console.log('restored state tu', restoredState),
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
