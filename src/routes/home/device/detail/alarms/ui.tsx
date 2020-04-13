import { TAlarm } from '@euc-tricorder/providers';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

export const Alarm = styled.View`
  margin: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Value = styled.Text`
  font-size: 30px;
  flex: 1;
`;

type TAlarmDirection = {
  direction: TAlarm['direction'];
  onToggle?: () => void;
};

export const AlarmDirection = ({ direction, onToggle }: TAlarmDirection) => {
  const icon = (
    <Icon name={direction === 'down' ? 'arrow-down' : 'arrow-up'} size={40} />
  );

  if (onToggle) {
    return <TouchableOpacity onPress={onToggle}>{icon}</TouchableOpacity>;
  }

  return icon;
};
