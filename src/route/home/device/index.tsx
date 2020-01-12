import React, { useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { useAdapter } from '../../../providers';
import { Speedometer } from './speedometer';
import { Thermometer } from './thermometer';

export const Device = () => {
  const { adapter } = useAdapter();

  console.log('adapter in monitor', adapter);

  useEffect(() => {
    if (adapter) {
      adapter.connect();
    }
  }, [adapter]);

  return (
    <SafeAreaView>
      {adapter ? (
        <>
          <Speedometer />
          <Thermometer />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};
