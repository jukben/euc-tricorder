import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import styled from 'styled-components/native';

import { useAdapter, usePebbleClient } from '../../../providers';
import { Metrics } from './metrics';

const Container = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const Device = () => {
  const { adapter } = useAdapter();
  const { registerListener, connected } = usePebbleClient();
  const [connectedToPebble, setConnectionToPebble] = useState(connected);

  useEffect(() => {
    const unregister = registerListener(event => {
      if (event.name === 'ConnectionChange') {
        setConnectionToPebble(event.payload);
      }
    });

    return unregister;
  }, [registerListener]);

  return (
    <SafeAreaView>
      <Container>
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
