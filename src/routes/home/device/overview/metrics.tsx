import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

import { Stack as DeviceNavigatorStack } from '..';
import { Characteristic } from './characteristic';
import { FlicButton } from './flic-button';
import { Pebble } from './pebble';

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

export const Metrics = () => {
  const navigation = useNavigation<NavigationProp<DeviceNavigatorStack>>();

  return (
    <>
      {/* sync with Pebble  */}
      <Pebble />
      {/* listen for Flic press */}
      <FlicButton action="click" />

      <Container>
        <Characteristic
          Icon={() => <Icon name="thermometer" size={40} />}
          onPress={() =>
            navigation.navigate('Detail', { characteristic: 'temperature' })
          }
          description="°C"
          name="temperature"
        />
        <Characteristic
          Icon={() => <Icon name="speedometer" size={40} />}
          onPress={() =>
            navigation.navigate('Detail', { characteristic: 'speed' })
          }
          description="km/h"
          name="speed"
        />
        <Characteristic
          Icon={() => <Icon name="battery-outline" size={40} />}
          onPress={() =>
            navigation.navigate('Detail', { characteristic: 'battery' })
          }
          description="%"
          name="battery"
        />
        <Characteristic
          Icon={() => <Icon name="alert" size={40} />}
          onPress={() =>
            navigation.navigate('Detail', { characteristic: 'voltage' })
          }
          description="V"
          name="voltage"
        />
      </Container>
    </>
  );
};
