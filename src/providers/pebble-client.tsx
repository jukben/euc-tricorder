import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

type ConnectionChangeEvent = {
  name: 'ConnectionChange';
  payload: boolean;
};

type ButtonPressedEvent = {
  name: 'ButtonPressed';
  payload: 'up' | 'down';
};

type ReadyEvent = {
  name: 'Ready';
  payload: boolean;
};

type PublicEvents = ConnectionChangeEvent | ButtonPressedEvent;

type Listener = (event: PublicEvents) => void;

export type PebbleClientApi = {
  sendUpdate: PebbleClient['sendUpdate'];
  connected: boolean;
  registerListener: (listener: Listener) => () => void;
};

const PebbleClientContext = React.createContext<PebbleClientApi>(
  (null as unknown) as PebbleClientApi,
);

export const usePebbleClient = () => useContext(PebbleClientContext);

export const PebbleClientProvider: React.FC = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const listeners = useRef<Array<Listener | undefined>>([]);

  const handleMessage = (event: PublicEvents) => {
    listeners.current.forEach(listener => {
      listener && listener(event);
    });
  };

  useEffect(() => {
    PebbleClient.configure(PEBBLE_APP_UUID);

    const subscriptions = [
      pebbleClientEmitter.addListener(
        'PebbleConnected',
        ({ name }: PebbleWatch) => {
          console.log(`Pebble ${name} has been connected!`);
          setConnected(true);
          handleMessage({ name: 'ConnectionChange', payload: true });
        },
      ),
      pebbleClientEmitter.addListener(
        'PebbleDisconnected',
        ({ name }: PebbleWatch) => {
          console.log(`Pebble ${name} has been disconnected!`);
          setConnected(false);
          handleMessage({ name: 'ConnectionChange', payload: false });
        },
      ),
      pebbleClientEmitter.addListener(
        'PebbleMessage',
        (event: ButtonPressedEvent | ReadyEvent) => {
          if (event.name === 'Ready') {
            handleMessage({ name: 'ConnectionChange', payload: event.payload });
            return;
          }

          handleMessage(event);
        },
      ),
    ];

    PebbleClient.run();

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
      PebbleClient.destroy();
    };
  }, [connected]);

  const sendUpdate = useCallback(
    (data: Data) =>
      PebbleClient.sendUpdate({
        ...data,
      }),
    [],
  );

  const registerListener = useCallback((listener: Listener) => {
    const id = listeners.current.push(listener) - 1;

    return () => delete listeners.current[id];
  }, []);

  const api: PebbleClientApi = useMemo(
    () => ({
      connected,
      sendUpdate,
      registerListener,
    }),
    [connected, registerListener, sendUpdate],
  );

  return (
    <PebbleClientContext.Provider value={api}>
      {children}
    </PebbleClientContext.Provider>
  );
};
