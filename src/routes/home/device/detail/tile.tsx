import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View``;

const Value = styled.Text`
  text-align: center;
  font-size: 30px;
`;

const Description = styled.Text`
  text-align: center;
  font-size: 18px;
  color: gray;
`;

type Props = {
  value: number;
  description: string;
};

export const Tile = ({ value, description }: Props) => (
  <Container>
    <Value>{value}</Value>
    <Description>{description}</Description>
  </Container>
);
