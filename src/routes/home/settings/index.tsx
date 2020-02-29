import { APP_VERSION } from '@euc-tricorder/core';
import { useSettings } from '@euc-tricorder/providers/settings';
import React from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import styled from 'styled-components/native';

import { HomeNavigatorProps } from '..';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

export const SettingsScreen = (props: HomeNavigatorProps<'Settings'>) => {
  const { removeSettingsForKey } = useSettings();

  const handleDisconnect = () => {
    removeSettingsForKey('device');
    props.navigation.navigate('Register', { screen: 'Search' });
  };

  return (
    <SafeAreaView>
      <Container>
        <Text>EUC Tricorder – {APP_VERSION}</Text>
        <Button onPress={handleDisconnect} title="Restart" />
      </Container>
    </SafeAreaView>
  );
};
