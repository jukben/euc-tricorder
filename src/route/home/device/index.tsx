import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import styled from 'styled-components/native';

import { useAdapter, useFlicClient, usePebbleClient } from '../../../providers';
import { Metrics } from './metrics';

const Container = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const Device = () => {
  const { adapter } = useAdapter();
  const {
    registerListener: pebbleRegisterListener,
    connected: pebbleConnect,
  } = usePebbleClient();
  const { connected: flicConnected } = useFlicClient();

  const [connectedToPebble, setConnectionToPebble] = useState(pebbleConnect);

  useEffect(() => {
    const unregister = pebbleRegisterListener(event => {
      if (event.name === 'ConnectionChange') {
        setConnectionToPebble(event.payload);
      }
    });

    return unregister;
  }, [pebbleRegisterListener]);

  return (
    <SafeAreaView>
      <Container>
        {flicConnected ? (
          <Text>connected to flic</Text>
        ) : (
          <Text>disconnected from flic</Text>
        )}
        {connectedToPebble ? (
          <Text>connected to pebble</Text>
        ) : (
          <Text>disconnected to pebble</Text>
        )}
        {adapter ? <Metrics /> : <ActivityIndicator />}
      </Container>
    </SafeAreaView>
  );
};
