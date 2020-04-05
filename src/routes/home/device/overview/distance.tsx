import { useAdapter } from '@euc-tricorder/providers';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CurrentDistance = styled.Text`
  font-size: 62px;
`;

const TotalDistance = styled.Text`
  font-size: 22px;
`;

export const Distance = () => {
  const { adapter } = useAdapter();
  const [currentDistance, setCurrentDistance] = useState<string>('0.0');
  const [totalDistance, setTotalDistance] = useState<string | null>(null);

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData((newData) => {
      if (newData.currentDistance) {
        setCurrentDistance((newData.currentDistance / 1000).toFixed(1));
      }

      if (newData.totalDistance) {
        setTotalDistance((newData.totalDistance / 1000).toFixed(1));
      }
    });

    return unsubscribe;
  }, [adapter]);

  return (
    <Container>
      {!currentDistance || !totalDistance ? (
        <ActivityIndicator />
      ) : (
        <>
          <CurrentDistance>{currentDistance} Km</CurrentDistance>
          <TotalDistance>{totalDistance} Km</TotalDistance>
        </>
      )}
    </Container>
  );
};
