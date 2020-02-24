import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import { Tile } from './tile';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const getAverage = (arr: Array<number>) =>
  Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

export const getMin = (arr: Array<number>) => Math.round(Math.min(...arr));

export const getMax = (arr: Array<number>) => Math.round(Math.max(...arr));

type Props = {
  telemetry: Array<number>;
};

export const Statistics = (props: Props) => {
  const { telemetry } = props;

  if (!telemetry.length) {
    return (
      <Container>
        <ActivityIndicator />
      </Container>
    );
  }

  const min = getMin(telemetry);
  const max = getMax(telemetry);
  const average = getAverage(telemetry);

  return (
    <Container>
      <Tile value={min} description="Min" />
      <Tile value={average} description="Average" />
      <Tile value={max} description="Max" />
    </Container>
  );
};
