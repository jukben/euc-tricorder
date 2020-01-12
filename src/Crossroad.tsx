import React, { useEffect, useReducer, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as routes from './route';
import { ActivityIndicator } from 'react-native-paper';
import { CustomNavigatorProps } from './types';
import { SafeAreaView } from 'react-native';
import { useSettings, TSettings } from './providers/settings';
import { useBle } from './providers';

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
  | { phase: 'auto-connect'; device: NonNullable<TSettings['device']> }
  | { phase: 'register' };

type Action =
  | { type: 'init' }
  | { type: 'loaded'; device: TSettings['device'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded': {
      const { device } = action;

      if (!device) {
        return { phase: 'register' };
      }

      return { phase: 'auto-connect', device };
    }

    default: {
      return state;
    }
  }
}

export const Crossroad: React.FC = () => {
  const { getSettingsForKey } = useSettings();
  const { manager } = useBle();
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });

  const getDeviceToJoin = useCallback(async () => {
    const rememberedDevice = await getSettingsForKey('device');
    setTimeout(
      () => dispatch({ type: 'loaded', device: rememberedDevice }),
      1000,
    );
  }, [getSettingsForKey]);

  useEffect(() => {
    getDeviceToJoin();
  }, [getDeviceToJoin]);

  const { phase } = state;

  return phase === 'loading' ? (
    <SafeAreaView>
      <ActivityIndicator />
    </SafeAreaView>
  ) : (
    <Root.Navigator
      initialRouteName={phase === 'auto-connect' ? 'Home' : 'Register'}
      screenOptions={{ headerShown: false }}>
      <Root.Screen name="Register" component={routes.Register} />
      <Root.Screen name="Home" component={routes.Home} />
    </Root.Navigator>
  );
};
