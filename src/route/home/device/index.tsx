import React from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

import { useAdapter } from '../../../providers';
import { Metrics } from './metrics';

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
