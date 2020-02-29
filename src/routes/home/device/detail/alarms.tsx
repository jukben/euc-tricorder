import { DeviceData } from '@euc-tricorder/adapters';
import { useAlarm } from '@euc-tricorder/providers';
import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

import { NewAlarm } from './new-alarm';

const Container = styled.View``;

export const Alarm = styled.View`
  margin: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const AlarmValue = styled.Text`
  font-size: 30px;
`;

const AlarmRemove = styled.Button``;

type Props = {
  characteristic: keyof DeviceData;
};

export const Alarms = ({ characteristic }: Props) => {
  const { data, addAlarm, removeAlarm } = useAlarm();

  const { list, alarm } = data;

  const alarms = list[characteristic];

  const handleRemove = (id: string) => {
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
  };

  return (
    <Container>
      <NewAlarm onAdd={({ value }) => addAlarm({ characteristic, value })} />
      {alarms.map(id => {
        const { value } = alarm[id];

        return (
          <Alarm key={id}>
            <AlarmValue>{value}</AlarmValue>
            <AlarmRemove title="Remove" onPress={() => handleRemove(id)} />
          </Alarm>
        );
      })}
    </Container>
  );
};
