import { telemetryReducer } from './telemetry';

jest.mock('./pebble-client.tsx');
jest.mock('./flic-client.tsx');
jest.mock('../core/environment.ts');

/**
 * @TODO Let's revisit this test because it tests implementation details
 */
test('can reduce state correctly', () => {
  const initialState = {
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

  const { battery, current, speed, temperature, voltage } = telemetryReducer(
    initialState,
    action,
  );

  expect(speed.length).toBe(1);
  expect(speed[0]).toEqual(
    expect.objectContaining({
      value: 1,
      isoString: expect.any(String),
    }),
  );

  expect(voltage.length).toBe(1);
  expect(voltage[0]).toEqual(
    expect.objectContaining({
      value: 2,
      isoString: expect.any(String),
    }),
  );

  expect(current.length).toBe(1);
  expect(current[0]).toEqual(
    expect.objectContaining({
      value: 3,
      isoString: expect.any(String),
    }),
  );

  expect(temperature.length).toBe(1);
  expect(temperature[0]).toEqual(
    expect.objectContaining({
      value: 4,
      isoString: expect.any(String),
    }),
  );

  expect(battery.length).toBe(1);
  expect(battery[0]).toEqual(
    expect.objectContaining({
      value: 5,
      isoString: expect.any(String),
    }),
  );
});
