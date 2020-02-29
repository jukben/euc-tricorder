import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useReducer } from 'react';
import { Button, Switch, TextInput } from 'react-native';

import { Alarm, AlarmValue } from './alarms';

const initialState = {
  isEditing: false,
  value: '',
};

type State = typeof initialState;

type Action =
  | { type: 'SET_VALUE'; value: string }
  | { type: 'ADD' }
  | { type: 'DONE' };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VALUE': {
      const { value } = action;

      return { ...state, value };
    }

    case 'ADD': {
      return { ...state, isEditing: true };
    }

    case 'DONE': {
      return { ...state, isEditing: false, value: '' };
    }

    default: {
      return state;
    }
  }
}

type Props = {
  onAdd: ({ value }: { value: number }) => void;
};

export const NewAlarm = ({ onAdd }: Props) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isEditing, value } = state;

  const numberValue = parseInt(value, 10);

  const handleDone = useCallback(() => {
    dispatch({ type: 'DONE' });
    onAdd({ value: numberValue });
  }, [numberValue, onAdd]);

  const handleAdd = useCallback(() => {
    dispatch({ type: 'ADD' });
  }, []);

  const handleOnChangeValue = useCallback(
    (newValue: string) => {
      dispatch({ type: 'SET_VALUE', value: newValue });
    },
    [dispatch],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isEditing ? (
          // allow to save alarm for 5 or higher only
          numberValue >= 5 ? (
            <Button onPress={handleDone} title="Done" />
          ) : null
        ) : (
          <Button onPress={handleAdd} title="Add alarm" />
        ),
    });
  }, [handleAdd, handleDone, isEditing, navigation, numberValue]);

  if (!isEditing) {
    return null;
  }

  return (
    <Alarm>
      <AlarmValue
        as={TextInput}
        autoFocus={true}
        keyboardType={'number-pad'}
        onChangeText={handleOnChangeValue}
        value={value}
      />
    </Alarm>
  );
};
