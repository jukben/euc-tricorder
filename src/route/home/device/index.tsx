import React from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';

import { useAdapter } from '../../../providers';
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

  return (
    <SafeAreaView>
      <Container>
        <Header />
        {/* <Content>
          <Metrics />
        </Content> */}
        <Content>{adapter ? <Metrics /> : <ActivityIndicator />}</Content>
      </Container>
    </SafeAreaView>
  );
};
