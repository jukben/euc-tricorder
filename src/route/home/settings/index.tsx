import React from 'react';
import { SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';

import { HomeNavigatorProps } from '..';
import { useSettings } from '../../../providers/settings';

export const Settings = (_props: HomeNavigatorProps<'Settings'>) => {
  const { removeSettingsForKey } = useSettings();

  const handleDisconnect = () => {
    removeSettingsForKey('device');
  };

  return (
    <SafeAreaView>
      <Button onPress={handleDisconnect}>Disconnect</Button>
    </SafeAreaView>
  );
};
