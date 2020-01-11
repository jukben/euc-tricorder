import { BleAPI } from '../providers';
import { Device as BleDevice } from 'react-native-ble-plx';

export type DeviceData = {
  speed: number;
  voltage: number;
  current: number;
  temperature: number;
  battery: number;
};

export type AdapterID = string;

type Adapter = (
  device: BleDevice,
  bleApi: BleAPI,
) => {
  getId: () => AdapterID;
  getAdapterName: () => string;
  getName: () => string;
  connect: () => Promise<unknown>;
  disconnect: () => Promise<unknown>;
  isConnected: () => Promise<boolean>;
  addListener: (listener: (deviceData: DeviceData) => void) => number;
  removeListener: (id: number) => void;
};

export type AdapterFactory = ReturnType<typeof createAdapter>;
export type AdapterService = ReturnType<AdapterFactory>;

// TODO add validity of Adapter's shape API
export const createAdapter = (name: AdapterID, adapter: Adapter) => {
  const adapterFactory = (...args: Parameters<Adapter>) => adapter(...args);

  adapterFactory.adapterName = name;

  return adapterFactory;
};
