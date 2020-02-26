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
  data: Array<number>;
};

export const Statistics = (props: Props) => {
  const { data } = props;

  if (!data.length) {
    return (
      <Container>
        <ActivityIndicator />
      </Container>
    );
  }

  const min = getMin(data);
  const max = getMax(data);
  const average = getAverage(data);

  return (
    <Container>
      <Tile value={min} description="Min" />
      <Tile value={average} description="Average" />
      <Tile value={max} description="Max" />
    </Container>
  );
};
