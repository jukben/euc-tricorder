import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TNavigatorProps } from '../../../App';
import { List } from 'react-native-paper';
import { adapters, createAdapter } from '../../adapters';
import { useBle, useAdapter } from '../../providers';

export const Connect = ({ route, navigation }: TNavigatorProps<'Connect'>) => {
  const [loading, setLoading] = useState(false);
  const bleApi = useBle();
  const { setAdapter } = useAdapter();
  const {
    params: { device },
  } = route;

  const handlePress = async (
    adapterFactory: ReturnType<typeof createAdapter>,
  ) => {
    setLoading(true);

    const adapter = adapterFactory(device, bleApi);

    setAdapter(adapter);

    await adapter.connect();

    navigation.navigate('Home');
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
            disabled={loading}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
};
