import React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { RegisterNavigatorProps } from '..';
import { AdapterFactory, adapters } from '../../../adapters';

export const PickAdapter = ({
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
