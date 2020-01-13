import React, { useEffect, useReducer, useCallback } from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import styled from 'styled-components/native';
import * as routes from './route';
import { CustomNavigatorProps } from './types';
import { ActivityIndicator } from 'react-native';
import { useSettings, TSettings } from './providers/settings';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Tts from 'react-native-tts';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export type Stack = {
  Register: {};
  Home: {
    device: TSettings['device'];
  };
};

export type CrossroadNavigatorProps<
  P extends keyof Stack
> = CustomNavigatorProps<StackNavigationProp<Stack>, Stack, P>;

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
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });

  const getDeviceToJoin = useCallback(async () => {
    const rememberedDevice = await getSettingsForKey('device');
    setTimeout(
      () => dispatch({ type: 'loaded', device: rememberedDevice }),
      1000,
    );
  }, [getSettingsForKey]);

  useEffect(() => {
    PushNotificationIOS.requestPermissions();
    Tts.setDucking(true);
    getDeviceToJoin();
  }, [getDeviceToJoin]);

  return state.phase === 'loading' ? (
    <Container>
      <ActivityIndicator />
    </Container>
  ) : (
    <Root.Navigator
      initialRouteName={state.phase === 'auto-connect' ? 'Home' : 'Register'}
      screenOptions={{ headerShown: false }}>
      <Root.Screen
        name="Home"
        component={routes.Home}
        initialParams={{
          device: state.phase === 'auto-connect' ? state.device : undefined,
        }}
      />
      <Root.Screen name="Register" component={routes.Register} />
    </Root.Navigator>
  );
};
