import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Device } from './device';

const Tab = createBottomTabNavigator();

export const Home = () => {
  return (
    <Tab.Navigator initialRouteName={'Device'}>
      <Tab.Screen
        name="Device"
        component={Device}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name={'speedometer'} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
