import { DeviceData } from '@euc-tricorder/adapters';
import { useSettings } from '@euc-tricorder/providers';
import produce from 'immer';
import nanoid from 'nanoid/non-secure';
import React, { useContext, useEffect, useReducer } from 'react';
import styled from 'styled-components/native';

export const Alarm = styled.View`
  margin: 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const AlarmValue = styled.Text`
  font-size: 30px;
`;

export type Alarm = { active: boolean; value: number; id: string };

type AlarmTypes = keyof DeviceData;

export type AlarmContext = {
  data: State;
  addAlarm: (alarm: { characteristic: AlarmTypes; value: number }) => void;
  updateAlarm: (alarm: {
    id: Alarm['id'];
    value: number;
    active: boolean;
  }) => void;
  removeAlarm: ({ id }: { id: Alarm['id'] }) => void;
};

const AlarmContext = React.createContext<AlarmContext>(
  (null as unknown) as AlarmContext,
);

export const useAlarm = () => useContext(AlarmContext);

const initialState = {
  list: {
    battery: [],
    speed: [],
    current: [],
    temperature: [],
    voltage: [],
  } as Record<AlarmTypes, Array<Alarm['id']>>,
  alarm: {} as Record<Alarm['id'], Alarm>,
};

type State = typeof initialState;

type Action =
  | {
      type: 'LOAD_FROM_STORAGE';
      data: State;
    }
  | { type: 'ADD'; value: Alarm['value']; characteristic: AlarmTypes }
  | {
      type: 'UPDATE';
      id: Alarm['id'];
      active: Alarm['active'];
      value: Alarm['value'];
    }
  | { type: 'REMOVE'; id: Alarm['id'] };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const { value, characteristic } = action;

      const newAlarm = { active: true, value, id: nanoid() };

      return {
        list: {
          ...state.list,
          [characteristic]: [newAlarm.id, ...state.list[characteristic]],
        },
        alarm: {
          ...state.alarm,
          [newAlarm.id]: newAlarm,
        },
      };
    }

    case 'UPDATE': {
      const { id, active, value } = action;

      return {
        ...state,
        alarm: {
          ...state.alarm,
          [id]: {
            ...state.alarm[id],
            active,
            value,
          },
        },
      };
    }

    case 'REMOVE': {
      return produce(state, draftState => {
        (Object.keys(draftState.list) as Array<AlarmTypes>).forEach(type => {
          draftState.list[type] = draftState.list[type].filter(
            id => id !== action.id,
          );
        });

        delete draftState.alarm[action.id];
      });
    }

    case 'LOAD_FROM_STORAGE': {
      return { ...action.data };
    }

    default: {
      return state;
    }
  }
}

export const AlarmProvider: React.FC = ({ children }) => {
  const { getSettingsForKey, setSettingsForKey } = useSettings();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const rehydrateState = async () => {
      const data = await getSettingsForKey('alarms');

      if (!data) {
        return;
      }

      dispatch({ type: 'LOAD_FROM_STORAGE', data });
    };

    rehydrateState();
  }, [getSettingsForKey]);

  useEffect(() => {
    setSettingsForKey('alarms', state);
  }, [setSettingsForKey, state]);

  return (
    <AlarmContext.Provider
      value={{
        data: state,
        addAlarm: ({ characteristic, value }) => {
          dispatch({ type: 'ADD', characteristic, value });
        },
        updateAlarm: ({ id, active, value }) => {
          dispatch({ type: 'UPDATE', id, value, active });
        },
        removeAlarm: ({ id }) => {
          dispatch({ type: 'REMOVE', id });
        },
      }}>
      {children}
    </AlarmContext.Provider>
  );
};
