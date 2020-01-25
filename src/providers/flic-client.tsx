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

type FlicClient = {
  configure: (key: string, secret: string) => void;
  destroy: () => void;
  grabButton: () => void;
} & EventSubscriptionVendor;

const { FlicClient } = NativeModules as { FlicClient: FlicClient };

const flicClientEmitter = new NativeEventEmitter(FlicClient);

const FLIC_APP_KEY = '41746ed0-dc76-4aca-bd23-0e68ec355430';
const FLIC_APP_SECRET = '3399ce33-b0a9-4966-9f1f-b28b2b8f73c3	';

type Flic = {
  name: string;
};

export type FlicClientApi = {
  connected: boolean;
  registerListener: (listener: any) => () => void;
};

const FlicClientContext = React.createContext<FlicClientApi>(
  (null as unknown) as FlicClientApi,
);

type ButtonActionEvent = {
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
