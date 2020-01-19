import { Device as BleDevice } from 'react-native-ble-plx';

import { defaultAdapter } from './default-adapter';

export type DeviceData = {
  speed: number;
  voltage: number;
  current: number;
  temperature: number;
  battery: number;
};

export type AdapterID = string;

export type AdapterApi = {
  bleConfiguration: {
    service: string;
    characteristic: string;
  };
  getData: (buffer: ArrayBuffer) => DeviceData | null; // or null? Does it make sense?
  afterConnect?: (device: BleDevice) => void | Promise<void>;
};

export type AdapterFactory = ReturnType<typeof createAdapter>;

export type AdapterService = {
  getId: () => AdapterID;
  getName: () => string;
  getAdapterName: () => string;
  testServicesAndCharacteristics: () => Promise<unknown>;
  connect: (onDisconnect?: () => void) => Promise<unknown>;
  disconnect: () => Promise<unknown>;
  isConnected: () => Promise<boolean>;
  addListener: (listener: (deviceData: DeviceData) => void) => number;
  removeListener: (id: number) => void;
};

export const createAdapter = (name: AdapterID, configuration: AdapterApi) => {
  const adapterFactory = (device: BleDevice): AdapterService =>
    defaultAdapter({ device, name }, configuration);

  adapterFactory.adapterName = name;

  return adapterFactory;
};
