import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

import { useAdapter, usePebbleClient } from '../../../providers';
import { Header } from './header';
import { Metrics } from './metrics';

const Container = styled.View`
  height: 100%;
  align-items: center;
  justify-content: flex-start;
`;

const Content = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const Device = () => {
  const { adapter } = useAdapter();
  const { connected, sendUpdate } = usePebbleClient();

  useEffect(() => {
    const updateConnectionStatus = () => {
      console.log('trying to update connection to pebble', {
        connectedToDevice: adapter ? 1 : 0,
        connectedToPhone: connected ? 1 : 0,
      });

      sendUpdate({
        connectedToDevice: adapter ? 1 : 0,
        connectedToPhone: connected ? 1 : 0,
      });
    };

    updateConnectionStatus();
  }, [adapter, connected, sendUpdate]);

  return (
    <SafeAreaView>
      <Container>
        <Header />
        <Content>{adapter ? <Metrics /> : <ActivityIndicator />}</Content>
      </Container>
    </SafeAreaView>
  );
};
