import nanoid from 'nanoid/non-secure';
import React, { useReducer } from 'react';
import { Switch } from 'react-native';
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

type Alarm = { active: boolean; value: number; id: string };

const initialState = {
  list: [] as Array<Alarm['id']>,
  alarm: {} as Record<Alarm['id'], Alarm>,
};

type State = typeof initialState;

type Action =
  | { type: 'ADD_ALARM'; value: number }
  | { type: 'ALARM_TOGGLED'; id: string; value: boolean };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ALARM': {
      const { value } = action;

      const newAlarm = { active: true, value, id: nanoid() };

      return {
        list: [newAlarm.id, ...state.list],
        alarm: {
          ...state.alarm,
          [newAlarm.id]: newAlarm,
        },
      };
    }

    case 'ALARM_TOGGLED': {
      const { id, value } = action;

      return {
        ...state,
        alarm: {
          ...state.alarm,
          [id]: {
            ...state.alarm[id],
            active: value,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
}

export const Alarms = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { list, alarm } = state;

  return (
    <Container>
      <NewAlarm onAdd={({ value }) => dispatch({ type: 'ADD_ALARM', value })} />
      {list.map(id => {
        const { value, active } = alarm[id];

        return (
          <Alarm key={id}>
            <AlarmValue>{value}</AlarmValue>
            <Switch
              value={active}
              onValueChange={newValue =>
                dispatch({ type: 'ALARM_TOGGLED', id, value: newValue })
              }
            />
          </Alarm>
        );
      })}
    </Container>
  );
};
