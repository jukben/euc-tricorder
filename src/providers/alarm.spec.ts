import nanoid from 'nanoid/non-secure';

import { reducer } from './alarm';

jest.mock('nanoid/non-secure');

jest.mock('./pebble-client.tsx');
jest.mock('./flic-client.tsx');

test('add', () => {
  (nanoid as jest.Mock).mockImplementation(() => '3467rtyuhjk-I');

  const state = {
    list: {
      speed: ['1'],
      voltage: [],
      current: [],
      temperature: [],
      battery: [],
    },
    alarm: {
      '1': { active: true, value: 1, id: '1' },
    },
  };

  const action = {
    type: 'ADD',
    value: 2,
    characteristic: 'speed',
  } as const;

  const expectedState = {
    list: {
      speed: ['3467rtyuhjk-I', '1'],
      voltage: [],
      current: [],
      temperature: [],
      battery: [],
    },
    alarm: {
      '1': { active: true, value: 1, id: '1' },
      '3467rtyuhjk-I': { active: true, value: 2, id: '3467rtyuhjk-I' },
    },
  };

  expect(reducer(state, action)).toEqual(expectedState);
});

test('remove', () => {
  const state = {
    list: {
      speed: ['1'],
      voltage: [],
      current: [],
      temperature: [],
      battery: [],
    },
    alarm: {
      '1': { active: true, value: 1, id: '1' },
    },
  };

  const action = {
    type: 'REMOVE',
    id: '1',
  } as const;

  const expectedState = {
    list: {
      speed: [],
      voltage: [],
      current: [],
      temperature: [],
      battery: [],
    },
    alarm: {},
  };

  expect(reducer(state, action)).toEqual(expectedState);
});
