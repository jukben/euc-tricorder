import React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { RegisterNavigatorProps } from '..';
import { adapters, AdapterFactory } from '../../../adapters';
import { useBle } from '../../../providers';

export const PickAdapter = ({
  route,
  navigation,
}: RegisterNavigatorProps<'PickAdapter'>) => {
  const bleApi = useBle();
  const {
    params: { device },
  } = route;

  const handlePress = async (adapterFactory: AdapterFactory) => {
    const adapter = adapterFactory(device, bleApi);

    navigation.navigate('Connect', { adapter });
  };

  return (
    <ScrollView>
      <List.Section>
        {adapters.map(adapter => (
          <List.Item
            key={adapter.adapterName}
            title={adapter.adapterName}
            onPress={() => {
              handlePress(adapter);
            }}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};
