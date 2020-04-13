import { fireEvent, render } from '@testing-library/react-native';
import nanoid from 'nanoid/non-secure';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { AlarmContext, AlarmProvider, useAlarm } from './alarm';

jest.mock('nanoid/non-secure');

jest.mock('./pebble-client.tsx');
jest.mock('./flic-client.tsx');
jest.mock('./settings.tsx');
jest.mock('../core/environment.ts');

type Props = {
  onData: (data: AlarmContext['data']) => void;
  onRemove?: (callback: ReturnType<typeof useAlarm>['removeAlarm']) => void;
  onAdd?: (callback: ReturnType<typeof useAlarm>['addAlarm']) => void;
  onUpdate?: (callback: ReturnType<typeof useAlarm>['updateAlarm']) => void;
};

const TestComponent = ({ onData, onAdd, onRemove, onUpdate }: Props) => {
  const { data, addAlarm, removeAlarm, updateAlarm } = useAlarm();

  useEffect(() => {
    onData(data);
  }, [data, onData]);

  return (
    <>
      <TouchableOpacity testID="add" onPress={() => onAdd && onAdd(addAlarm)} />
      <TouchableOpacity
        testID="remove"
        onPress={() => onRemove && onRemove(removeAlarm)}
      />
      <TouchableOpacity
        testID="update"
        onPress={() => onUpdate && onUpdate(updateAlarm)}
      />
    </>
  );
};

test('add', () => {
  (nanoid as jest.Mock).mockImplementation(() => '3467rtyuhjk-I');

  const handleData = jest.fn();

  const { getByTestId } = render(
    <AlarmProvider>
      <TestComponent
        onData={handleData}
        onAdd={(add) =>
          add({
            characteristic: 'speed',
            alarm: { active: true, direction: 'up', value: 20 },
          })
        }
      />
    </AlarmProvider>,
  );

  const addButton = getByTestId('add');
  fireEvent.press(addButton);

  expect(handleData).lastCalledWith({
    alarm: {
      '3467rtyuhjk-I': {
        active: true,
        direction: 'up',
        id: '3467rtyuhjk-I',
        value: 20,
      },
    },
    list: {
      battery: [],
      current: [],
      speed: ['3467rtyuhjk-I'],
      temperature: [],
      voltage: [],
      totalDistance: [],
      currentDistance: [],
      deviceUptime: [],
    },
  });
});

test('remove', () => {
  (nanoid as jest.Mock).mockImplementation(() => '3467rtyuhjk-I');

  const handleData = jest.fn();

  const { getByTestId } = render(
    <AlarmProvider>
      <TestComponent
        onData={handleData}
        onAdd={(add) =>
          add({
            characteristic: 'speed',
            alarm: { active: true, direction: 'up', value: 20 },
          })
        }
        onRemove={(remove) =>
          remove({
            id: '3467rtyuhjk-I',
          })
        }
      />
    </AlarmProvider>,
  );

  const addButton = getByTestId('add');
  const removeButton = getByTestId('remove');

  fireEvent.press(addButton);
  fireEvent.press(removeButton);

  expect(handleData).lastCalledWith({
    alarm: {},
    list: {
      battery: [],
      current: [],
      speed: [],
      temperature: [],
      voltage: [],
      totalDistance: [],
      currentDistance: [],
      deviceUptime: [],
    },
  });
});

test('update', () => {
  (nanoid as jest.Mock).mockImplementation(() => '3467rtyuhjk-I');

  const handleData = jest.fn();

  const { getByTestId } = render(
    <AlarmProvider>
      <TestComponent
        onData={handleData}
        onAdd={(add) =>
          add({
            characteristic: 'speed',
            alarm: { active: true, direction: 'up', value: 20 },
          })
        }
        onUpdate={(update) =>
          update({ alarm: { id: '3467rtyuhjk-I', active: false } })
        }
      />
    </AlarmProvider>,
  );

  const addButton = getByTestId('add');
  const updateAlarm = getByTestId('update');

  fireEvent.press(addButton);
  fireEvent.press(updateAlarm);

  expect(handleData).lastCalledWith({
    alarm: {
      '3467rtyuhjk-I': {
        active: false,
        direction: 'up',
        id: '3467rtyuhjk-I',
        value: 20,
      },
    },
    list: {
      battery: [],
      current: [],
      speed: ['3467rtyuhjk-I'],
      temperature: [],
      voltage: [],
      totalDistance: [],
      currentDistance: [],
      deviceUptime: [],
    },
  });
});
