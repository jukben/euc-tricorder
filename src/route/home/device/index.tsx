import React from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import { Metrics } from './metrics';

import { useAdapter } from '../../../providers';

const Container = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const Device = () => {
  const { adapter } = useAdapter();

  return (
    <SafeAreaView>
      <Container>{adapter ? <Metrics /> : <ActivityIndicator />}</Container>
    </SafeAreaView>
  );
};
