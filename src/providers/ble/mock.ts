import { BleManager, Device, State, Subscription } from 'react-native-ble-plx';

/**
 * Very naive version of BleManager
 */
export const BleManagerMock = () => {
  const api: {
    onStateChange: BleManager['onStateChange'];
    startDeviceScan: BleManager['startDeviceScan'];
    stopDeviceScan: BleManager['stopDeviceScan'];
    remove: Subscription['remove'];
  } = {
    onStateChange: callback => {
      callback('PoweredOn' as State);

      return {
        remove: () => null,
      };
    },
    startDeviceScan: (_uuid, _options, handle) => {
      handle(null, ({
        id: 'simulator-ks18l',
        name: 'Simulator KingSong-18L',
        connect: () => Promise.resolve(),
        discoverAllServicesAndCharacteristics: () => Promise.resolve(),
        readCharacteristicForService: () => Promise.resolve(),
        cancelConnection: () => Promise.resolve(),
      } as unknown) as Device);
    },
    stopDeviceScan: () => null,
    remove: () => null,
  };

  return api;
};
