import { BleAPI } from '../providers';
import { Device as BleDevice } from 'react-native-ble-plx';

type TAdapter = (
  device: BleDevice,
  bleApi: BleAPI,
) => {
  connect: () => Promise<any>;
};

export const createAdapter = (name: string, adapter: TAdapter) => {
  const adapterFactory = (...args: Parameters<TAdapter>) => adapter(...args);

  adapterFactory.adapterName = name;

  return adapterFactory;
};
