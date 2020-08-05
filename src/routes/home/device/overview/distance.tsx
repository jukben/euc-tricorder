import { useAdapter } from '@euc-tricorder/providers';
import React, { useEffect, useReducer } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import { Trip } from './trip';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CurrentDistance = styled.Text`
  font-size: 62px;
`;

const TotalDistance = styled.Text`
  font-size: 22px;
`;

const DeviceUptime = styled.Text`
  font-size: 16px;
`;

const initialState = {
  loaded: false,
  currentDistance: 0,
  totalDistance: 0,
  deviceUptime: '00:00:00',
};

type State = typeof initialState;

type Action = {
  type: 'UPDATE';
  currentDistance?: number;
  totalDistance?: number;
  deviceUptime?: string;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE': {
      const { currentDistance, totalDistance, deviceUptime } = action;
      return {
        ...state,
        loaded: true,
        ...(currentDistance && { currentDistance }),
        ...(totalDistance && { totalDistance }),
        ...(deviceUptime && { deviceUptime }),
      };
    }

    default: {
      return state;
    }
  }
}

export const Distance = () => {
  const { adapter } = useAdapter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const unsubscribe = adapter.handleData((newData) => {
      if (newData.currentDistance) {
        dispatch({
          type: 'UPDATE',
          currentDistance: newData.currentDistance / 1000,
        });
      }

      if (newData.totalDistance) {
        dispatch({
          type: 'UPDATE',
          totalDistance: newData.totalDistance / 1000,
        });
      }

      if (newData.deviceUptime) {
        /**
         * @see https://stackoverflow.com/a/52560608/2719917
         * @param val
         */
        const format = (val: number) => `0${Math.floor(val)}`.slice(-2);

        const seconds = newData.deviceUptime;
        const hours = seconds / 3600;
        const minutes = (seconds % 3600) / 60;

        const formattedUptime = [hours, minutes, seconds % 60]
          .map(format)
          .join(':');

        dispatch({
          type: 'UPDATE',
          deviceUptime: formattedUptime,
        });
      }
    });

    return unsubscribe;
  }, [adapter]);

  const { loaded, currentDistance, deviceUptime, totalDistance } = state;
  return (
    <Container>
      {!loaded ? (
        <ActivityIndicator />
      ) : (
        <>
          <CurrentDistance>{currentDistance.toFixed(1)} Km</CurrentDistance>
          <TotalDistance>{totalDistance.toFixed(1)} Km</TotalDistance>
          <DeviceUptime>{deviceUptime}</DeviceUptime>
          <Trip distance={totalDistance} />
        </>
      )}
    </Container>
  );
};
