import React, { useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { useAdapter } from '../../../providers';
import { Button } from 'react-native-paper';
import { useSettings } from '../../../providers/settings';
import { NavigatorProps } from '..';

export const Settings = ({ navigation }: NavigatorProps<'Settings'>) => {
  const { adapter } = useAdapter();
  const { removeSettingsForKey } = useSettings();

  const handleDisconnect = () => {
    console.log('disconnect');
    removeSettingsForKey('device');
  };

  return (
    <SafeAreaView>
      <Button onPress={handleDisconnect}>Disconnect</Button>
    </SafeAreaView>
  );
};
