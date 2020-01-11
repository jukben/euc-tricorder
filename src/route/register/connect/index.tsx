import React, { useEffect, useCallback, useReducer } from 'react';
import { Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useAdapter } from '../../../providers';
import { rememberDevice } from '../../../utils';
import { NavigatorProps } from '..';

type State = { phase: 'loading' } | { phase: 'error' } | { phase: 'connected' };
type Action = { type: 'failure' } | { type: 'connected' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'failure':
      return { phase: 'error' };
    case 'connected':
      return { phase: 'connected' };
    default:
      return state;
  }
}

export const Connect = ({ navigation }: NavigatorProps<'Connect'>) => {
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });
  const { adapter } = useAdapter();
  const { phase } = state;

  const connect = useCallback(async () => {
    if (!adapter) {
      return;
    }

    if (!(await adapter.isConnected())) {
      try {
        await adapter.connect();
        dispatch({ type: 'connected' });
      } catch (e) {
        console.error(e);
        dispatch({ type: 'failure' });
      }
    } else {
      dispatch({ type: 'connected' });
    }
  }, [adapter]);

  useEffect(() => {
    console.log('useEffect');
    connect();
  }, [connect]);

  useEffect(() => {
    if (phase === 'connected' && adapter) {
      rememberDevice(adapter);
      navigation.navigate('Home');
    }
  }, [phase, adapter, navigation]);

  return (
    <>
      {phase === 'connected' && adapter && (
        <Text>{adapter.getName() || 'Device'} is successfully registered!</Text>
      )}
      {phase === 'loading' && <ActivityIndicator />}
      {phase === 'error' && (
        <Text>
          Device couldn't be connected. Have you picked the correct adapter?
        </Text>
      )}
    </>
  );
};
