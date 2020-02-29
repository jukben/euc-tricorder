import { useAdapter, usePebbleClient } from '@euc-tricorder/providers';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

import { Header } from './header';
import { Metrics } from './metrics';

export type Stack = {
  Device: {};
};

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

export const OverviewScreen = () => {
  const { adapter } = useAdapter();
  const { connected, sendUpdate } = usePebbleClient();

  useEffect(() => {
    const updateConnectionStatus = () => {
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
