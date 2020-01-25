import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  EventSubscriptionVendor,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

type Data = {
  speed: number;
  battery: number;
  temperature: number;
  voltage: number;
  connectedToDevice: boolean;
};

type PebbleWatch = { name: string };

type PebbleClient = {
  run: () => void;
  destroy: () => void;
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

    const subscriptions = [
      pebbleClientEmitter.addListener(
        'PebbleConnected',
        ({ name }: PebbleWatch) => {
          console.log(`Pebble ${name} has been connected!`);
          setConnected(true);
        },
      ),
      pebbleClientEmitter.addListener(
        'PebbleDisconnected',
        ({ name }: PebbleWatch) => {
          console.log(`Pebble ${name} has been disconnected!`);
          setConnected(false);
        },
      ),
      pebbleClientEmitter.addListener('PebbleMessage', ({ name }) => {
        console.log(`Pebble sent event! ${name}`);
      }),
    ];

    PebbleClient.run();

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
      PebbleClient.destory();
    };
  }, [connected]);

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
