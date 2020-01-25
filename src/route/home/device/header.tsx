import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

import { useAdapter, useFlicClient, usePebbleClient } from '../../../providers';

const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #d3d3d3;
`;

const Row = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 10px;
`;

const getColorByStatus = (active: boolean) => (active ? 'green' : '#d3d3d3');

export const Header = () => {
  const {
    registerListener: pebbleRegisterListener,
    connected: pebbleConnect,
  } = usePebbleClient();
  const { connected: flicConnected } = useFlicClient();
  const { adapter } = useAdapter();

  const [pebbleConnected, setConnectionToPebble] = useState(pebbleConnect);

  useEffect(() => {
    const unregister = pebbleRegisterListener(event => {
      if (event.name === 'ConnectionChange') {
        setConnectionToPebble(event.payload);
      }
    });

    return unregister;
  }, [pebbleRegisterListener]);

  return (
    <Container>
      <Row>
        <Icon
          name="hockey-puck"
          size={30}
          color={getColorByStatus(flicConnected)}
        />
      </Row>
      {adapter ? (
        <Text>{adapter.getName()}</Text>
      ) : (
        <Text>Looking for your device</Text>
      )}
      <Row>
        <Icon
          name="watch"
          size={30}
          color={getColorByStatus(pebbleConnected)}
        />
      </Row>
    </Container>
  );
};
