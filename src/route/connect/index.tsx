import React from 'react';
import { Text } from 'react-native';
import { TNavigatorProps } from '../../../App';

export const Connect = ({ route }: TNavigatorProps<'Connect'>) => {
  const {
    params: { device },
  } = route;

  console.log('Connecting to', device.name);
  return (
    <>
      <Text>Home</Text>
    </>
  );
};
