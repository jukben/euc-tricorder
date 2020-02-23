import { useSettings } from '@euc-tricorder/providers/settings';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';

import { HomeNavigatorProps } from '..';

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
