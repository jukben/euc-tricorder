import React, { useEffect, useReducer } from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as routes from './route';
import {
  Provider as PaperProvider,
  ActivityIndicator,
} from 'react-native-paper';
import { BleProvider, AdapterProvider } from './providers';
import { getDevice, RememberedDevice } from './utils';
import { CustomNavigatorProps } from './types';

export type Stack = {
  Register: {};
  Home: {};
};

export type NavigatorProps<P extends keyof Stack> = CustomNavigatorProps<
  Stack,
  P
>;

const Root = createStackNavigator<Stack>();

type State =
  | { phase: 'loading' }
  | { phase: 'auto-connect'; device: NonNullable<RememberedDevice> }
  | { phase: 'register' };

type Action = { type: 'init' } | { type: 'loaded'; device: RememberedDevice };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded': {
      const { device } = action;

      if (device === null) {
        return { phase: 'register' };
      }

      return { phase: 'auto-connect', device };
    }

    default: {
      return state;
    }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });

  const getDeviceToJoin = async () => {
    const rememberedDevice = await getDevice();
    dispatch({ type: 'loaded', device: rememberedDevice });
  };

  useEffect(() => {
    getDeviceToJoin();
  }, []);

  const { phase } = state;

  return (
    <NavigationNativeContainer>
      <PaperProvider>
        <BleProvider>
          <AdapterProvider>
            {phase === 'loading' ? (
              <ActivityIndicator />
            ) : (
              <Root.Navigator
                initialRouteName={
                  phase === 'auto-connect' ? 'Home' : 'Register'
                }
                screenOptions={{ headerShown: false }}>
                <Root.Screen name="Register" component={routes.Register} />
                <Root.Screen name="Home" component={routes.Home} />
              </Root.Navigator>
            )}
          </AdapterProvider>
        </BleProvider>
      </PaperProvider>
    </NavigationNativeContainer>
  );
}

export default App;
