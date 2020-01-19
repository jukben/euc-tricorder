import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  EventSubscriptionVendor,
} from 'react-native';

type Data = {
  speed: number;
  battery: number;
  temperature: number;
};

type PebbleClient = {
  run: () => void;
  configure: (uuid: string) => void;
  sendUpdate: (data: Data) => Promise<void>;
} & EventSubscriptionVendor;

const { PebbleClient } = NativeModules as { PebbleClient: PebbleClient };

const pebbleClientEmitter = new NativeEventEmitter(PebbleClient);

const PEBBLE_APP_UUID = '281a8f21-594c-4cf2-a049-35a896ee8b27';

export type PebbleClientApi = {
  sendUpdate: PebbleClient['sendUpdate'];
  connected: boolean;
};

const PebbleClientContext = React.createContext<PebbleClientApi | null>(null);

export const usePebbleClient = () => useContext(PebbleClientContext);

export const PebbleClientProvider: React.FC = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    PebbleClient.configure(PEBBLE_APP_UUID);

    const subscription = pebbleClientEmitter.addListener(
      'PebbleConnected',
      watchName => {
        console.log(`Pebble ${watchName} has been connected!`);
        setConnected(true);
      },
    );

    PebbleClient.run();

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    PebbleClient.configure(PEBBLE_APP_UUID);

    const subscriptions = [
      pebbleClientEmitter.addListener('PebbleConnected', watchName => {
        console.log(`Pebble ${watchName} has been connected!`);
        setConnected(true);
      }),
      pebbleClientEmitter.addListener('PebbleDisconnected', watchName => {
        console.log(`Pebble ${watchName} has been disconnected!`);
        setConnected(false);
      }),
    ];

    PebbleClient.run();

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);

  const api = useMemo(
    () => ({
      connected,
      sendUpdate: (data: Data) =>
        PebbleClient.sendUpdate({
          ...data,
        }),
    }),
    [connected],
  );

  return (
    <PebbleClientContext.Provider value={api}>
      {children}
    </PebbleClientContext.Provider>
  );
};
