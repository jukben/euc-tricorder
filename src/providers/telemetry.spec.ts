import { reducer } from './telemetry';

jest.mock('./pebble-client.tsx');
jest.mock('./flic-client.tsx');

test('can reduce state correctly', () => {
  const state = {
    data: {
      speed: [],
      voltage: [],
      current: [],
      temperature: [],
      battery: [],
    },
  };

  const action = {
    type: 'ADD_SNAPSHOT',
    snapshot: {
      speed: 1,
      voltage: 2,
      current: 3,
      temperature: 4,
      battery: 5,
    },
  } as const;

  const expectedState = {
    data: {
      speed: [1],
      voltage: [2],
      current: [3],
      temperature: [4],
      battery: [5],
    },
  };

  expect(reducer(state, action)).toEqual(expectedState);
});
