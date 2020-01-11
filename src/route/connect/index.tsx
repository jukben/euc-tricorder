import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TNavigatorProps } from '../../../App';
import { List } from 'react-native-paper';
import { adapters, AdapterFactory } from '../../adapters';
import { useBle } from '../../providers';

export const Connect = ({ route, navigation }: TNavigatorProps<'Connect'>) => {
  const [loading, setLoading] = useState(false);
  const bleApi = useBle();
  const {
    params: { device },
  } = route;

  const handlePress = async (adapterFactory: AdapterFactory) => {
    setLoading(true);

    const adapter = adapterFactory(device, bleApi);

    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'Home', params: { adapter } }],
    // });
    navigation.navigate('Home', { adapter });
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
