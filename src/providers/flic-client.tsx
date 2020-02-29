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
import Config from 'react-native-config';
type FlicClient = {
  configure: (key: string, secret: string) => void;
  destroy: () => void;
  grabButton: () => void;
} & EventSubscriptionVendor;

/**
 * Known Issue: It doesn't get reconnected correctly in case of full reload
 */
const { FlicClient } = NativeModules as { FlicClient: FlicClient };

const flicClientEmitter = new NativeEventEmitter(FlicClient);

const FLIC_APP_KEY = Config.FLIC_APP_KEY;
const FLIC_APP_SECRET = Config.FLIC_APP_SECRET;

type Flic = {
  name: string;
};

export type ButtonActionEvent = {
  name: 'ButtonAction';
  payload: 'click' | 'hold';
};

type ButtonConnected = {
  name: 'ButtonConnected';
  payload: {
    name: string;
  };
};

type Events = ButtonConnected | ButtonActionEvent;

type Listener = (event: Events) => void;

type FlicClientApi = {
  connected: boolean;
  registerListener: (listener: Listener) => () => void;
  grabButton: () => void;
};

const FlicClientContext = React.createContext<FlicClientApi>(
  (null as unknown) as FlicClientApi,
);

export const useFlicClient = () => useContext(FlicClientContext);

export const FlicClientProvider: React.FC = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const listeners = useRef<Array<Listener | undefined>>([]);

  const handleMessage = (event: Events) => {
    listeners.current.forEach(listener => {
      listener && listener(event);
    });
  };

  useEffect(() => {
    FlicClient.configure(FLIC_APP_KEY, FLIC_APP_SECRET);

    const subscriptions = [
      flicClientEmitter.addListener('FlicConnected', ({ name }: Flic) => {
        console.log(`Flic ${name} has been connected!`);
        setConnected(true);
        handleMessage({ name: 'ButtonConnected', payload: { name } });
      }),
      flicClientEmitter.addListener(
        'FlicAction',
        (payload: ButtonActionEvent['payload']) => {
          handleMessage({ name: 'ButtonAction', payload });
        },
      ),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
      FlicClient.destroy();
    };
  }, []);

  // rewrite to reuse deleted ids
  const registerListener = useCallback((listener: Listener) => {
    const id = listeners.current.push(listener) - 1;

    return () => delete listeners.current[id];
  }, []);

  const api: FlicClientApi = useMemo(
    () => ({
      connected,
      registerListener,
      grabButton: FlicClient.grabButton,
    }),
    [connected, registerListener],
  );

  return (
    <FlicClientContext.Provider value={api}>
      {children}
    </FlicClientContext.Provider>
  );
};
