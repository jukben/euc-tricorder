import React from 'react';
import { ScrollView } from 'react-native';
import { TNavigatorProps } from '../../../App';
import { List } from 'react-native-paper';
import { adapters, createAdapter } from '../../adapters';
import { useBle } from '../../providers';

export const Connect = ({ route }: TNavigatorProps<'Connect'>) => {
  const bleApi = useBle();
  const {
    params: { device },
  } = route;

  const handlePress = (adapter: ReturnType<typeof createAdapter>) => {
    const { connect } = adapter(device, bleApi);

    connect();
  };

  return (
    <ScrollView>
      <List.Section>
        {adapters.map(adapter => (
          <List.Item
            key={adapter.adapterName}
            title={adapter.adapterName}
            onPress={() => handlePress(adapter)}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};
