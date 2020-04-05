import { DeviceData } from '@euc-tricorder/adapters';
import { TAlarm, useAlarm } from '@euc-tricorder/providers';
import React, { useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

import { NewAlarm } from './new-alarm';

const Container = styled.View``;

export const Alarm = styled.View`
  margin: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Value = styled.Text`
  font-size: 30px;
  flex: 1;
`;

const AlarmRemove = styled.Button``;

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

type Props = {
  characteristic: keyof DeviceData;
};

export const Alarms = ({ characteristic }: Props) => {
  const { data, addAlarm, removeAlarm } = useAlarm();

  const { list, alarm } = data;

  const alarms = list[characteristic];

  const handleRemove = useCallback(
    (id: string) => {
      Alert.alert(
        'Remove alarm',
        'Do you want to remove this alarm?',
        [
          {
            text: 'Yes',
            onPress: () => removeAlarm({ id }),
          },
          {
            text: 'No',
          },
        ],
        { cancelable: true },
      );
    },
    [removeAlarm],
  );

  const handleAdd = useCallback(
    ({
      value,
      direction,
    }: {
      value: number;
      direction: TAlarm['direction'];
    }) => {
      addAlarm({
        characteristic,
        alarm: { active: true, value, direction },
      });
    },
    [addAlarm, characteristic],
  );

  return (
    <Container>
      <NewAlarm onAdd={handleAdd} />
      {alarms.map((id) => {
        const { value, direction } = alarm[id];

        return (
          <Alarm key={id}>
            <Value>{value}</Value>
            <AlarmDirection direction={direction} />
            <AlarmRemove title="Remove" onPress={() => handleRemove(id)} />
          </Alarm>
        );
      })}
    </Container>
  );
};
