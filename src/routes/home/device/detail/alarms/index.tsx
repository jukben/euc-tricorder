import { DeviceData } from '@euc-tricorder/adapters';
import { TAlarm, useAlarm } from '@euc-tricorder/providers';
import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

import { NewAlarm } from './new-alarm';
import { Alarm, AlarmDirection, Value } from './ui';

const Container = styled.View``;

const AlarmRemove = styled.Button``;

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
