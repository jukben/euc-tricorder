import { AdapterFactory, adapters } from '@euc-tricorder/adapters';
import { RegisterNavigatorProps } from '@euc-tricorder/routes/register';
import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

const Item = styled.Button``;

export const PickAdapterScreen = ({
  route,
  navigation,
}: RegisterNavigatorProps<'PickAdapter'>) => {
  const {
    params: { device },
  } = route;

  const handlePress = async (adapterFactory: AdapterFactory) => {
    const adapter = adapterFactory(device);

    navigation.navigate('Connect', { adapter });
  };

  return (
    <ScrollView>
      {adapters.map((adapter) => (
        <Item
          key={adapter.adapterName}
          title={adapter.adapterName}
          onPress={() => {
            handlePress(adapter);
          }}
        />
      ))}
    </ScrollView>
  );
};
