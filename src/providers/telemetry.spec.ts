import { telemetryReducer } from './telemetry';

jest.mock('./pebble-client.tsx');
jest.mock('./flic-client.tsx');
jest.mock('../core/environment.ts');

test('can reduce state correctly', () => {
  const state = {
    speed: [],
    voltage: [],
    current: [],
    temperature: [],
    battery: [],
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
    speed: [1],
    voltage: [2],
    current: [3],
    temperature: [4],
    battery: [5],
  };

  expect(telemetryReducer(state, action)).toEqual(expectedState);
});
