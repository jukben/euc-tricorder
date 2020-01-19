import React, { useCallback, useEffect, useReducer } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import styled from 'styled-components/native';

import { RegisterNavigatorProps } from '..';
import { useSettings } from '../../../providers';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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

export const Connect = ({
  navigation,
  route,
}: RegisterNavigatorProps<'Connect'>) => {
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });
  const { setSettingsForKey } = useSettings();
  const { phase } = state;
  const {
    params: { adapter },
  } = route;

  const connect = useCallback(async () => {
    try {
      await adapter.testServicesAndCharacteristics();
      dispatch({ type: 'connected' });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'failure' });
    }
  }, [adapter]);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (phase === 'connected' && adapter) {
      const device = {
        id: adapter.getId(),
        adapter: adapter.getAdapterName(),
      };

      setSettingsForKey('device', device);
      navigation.navigate('Home', { device });
    }
  }, [phase, adapter, setSettingsForKey, navigation]);

  return (
    <Container>
      {phase === 'loading' && <ActivityIndicator />}
      {phase === 'connected' && adapter && (
        <Text>{adapter.getName() || 'Device'} is successfully registered!</Text>
      )}
      {phase === 'error' && <Text>Device couldn't be connected!</Text>}
    </Container>
  );
};
