import AsyncStorage from '@react-native-community/async-storage';
import { AdapterService, AdapterID } from './adapters';

export type RememberedDevice = { id: AdapterID; adapter: string } | null;

export const rememberDevice = async (adapter: AdapterService) => {
  await AsyncStorage.setItem(
    'device',
    JSON.stringify({ id: adapter.getId(), adapter: adapter.getAdapterName() }),
  );
};

export const getDevice = async () => {
  const data = await AsyncStorage.getItem('device');

  if (!data) {
    return null;
  }

  return JSON.parse(data) as RememberedDevice;
};
