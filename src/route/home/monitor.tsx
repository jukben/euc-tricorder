import React, { useEffect, useCallback, useReducer } from 'react';
import { Text } from 'react-native';
import { useAdapter } from '../../providers';
import { ActivityIndicator } from 'react-native-paper';
import { Speedometer } from './speedometer';

const initState = { isLoading: true, hasError: false, isConnected: false };
type State = typeof initState;
type Action = { type: 'init' | 'failure' | 'connected' };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'init':
      return { isLoading: true, hasError: false, isConnected: false };
    case 'connected':
      return { isLoading: false, hasError: false, isConnected: true };
    case 'failure':
      return { isLoading: false, hasError: true, isConnected: false };
  }
}

export const Monitor = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  const { adapter } = useAdapter();

  const connect = useCallback(async () => {
    if (!adapter) {
      return;
    }

    if (!(await adapter.isConnected())) {
      try {
        await adapter.connect(() => {
          // go to quick connect window
          dispatch({ type: 'init' });
        });
        dispatch({ type: 'connected' });
      } catch (e) {
        console.error(e);
        dispatch({ type: 'failure' });
      }
    }
  }, [adapter]);

  useEffect(() => {
    console.log('useEffect');
    connect();
  }, [connect]);

  const { hasError, isLoading, isConnected } = state;
  return (
    <>
      {isConnected && <Speedometer />}
      {isLoading && <ActivityIndicator />}
      {hasError && (
        <Text>
          Device couldn't be connected. Have you picked the correct adapter?
        </Text>
      )}
    </>
  );
};
