import React from 'react';
import { Text } from 'react-native';
import { useAdapter } from '../../providers';

export const Home = () => {
  const { adapter } = useAdapter();

  console.log(adapter);

  return <Text>Home</Text>;
};
