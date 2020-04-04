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

export type TAlarm = {
  direction: 'up' | 'down';
  active: boolean;
  value: number;
  id: string;
};

type AlarmTypes = keyof DeviceData;

export type AlarmContext = {
  data: State;
  addAlarm: (add: {
    characteristic: AlarmTypes;
    alarm: Omit<TAlarm, 'id'>;
  }) => void;
  updateAlarm: (alarm: {
    alarm: { id: TAlarm['id'] } & Partial<Omit<TAlarm, 'id'>>;
  }) => void;
  removeAlarm: ({ id }: { id: TAlarm['id'] }) => void;
};

const initialState = {
  list: {
    battery: [],
    speed: [],
    current: [],
    temperature: [],
    voltage: [],
  } as Record<AlarmTypes, Array<TAlarm['id']>>,
  alarm: {} as Record<TAlarm['id'], TAlarm>,
};

const AlarmContext = React.createContext<AlarmContext>({
  data: initialState,
} as AlarmContext);

export const useAlarm = () => useContext(AlarmContext);

type State = typeof initialState;

type Action =
  | {
      type: 'LOAD_FROM_STORAGE';
      data: State;
    }
  | { type: 'ADD'; alarm: Omit<TAlarm, 'id'>; characteristic: AlarmTypes }
  | {
      type: 'UPDATE';
      alarm: { id: TAlarm['id'] } & Partial<Omit<TAlarm, 'id'>>;
    }
  | { type: 'REMOVE'; id: TAlarm['id'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const {
        alarm: { value, active, direction },
        characteristic,
      } = action;

      const newAlarm: TAlarm = { id: nanoid(), active, value, direction };

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
      const { alarm } = action;

      const id = alarm.id;

      const {
        active = state.alarm[id].active,
        direction = state.alarm[id].direction,
        value = state.alarm[id].value,
      } = alarm;

      return {
        ...state,
        alarm: {
          ...state.alarm,
          [id]: {
            ...state.alarm[id],
            active,
            value,
            direction,
          },
        },
      };
    }

    case 'REMOVE': {
      return produce(state, (draftState) => {
        (Object.keys(draftState.list) as Array<AlarmTypes>).forEach((type) => {
          draftState.list[type] = draftState.list[type].filter(
            (id) => id !== action.id,
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
        addAlarm: ({ characteristic, alarm }) => {
          dispatch({ type: 'ADD', characteristic, alarm });
        },
        updateAlarm: ({ alarm }) => {
          dispatch({ type: 'UPDATE', alarm });
        },
        removeAlarm: ({ id }) => {
          dispatch({ type: 'REMOVE', id });
        },
      }}>
      {children}
    </AlarmContext.Provider>
  );
};
