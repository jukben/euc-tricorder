import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  State,
  Subscription,
} from 'react-native-ble-plx';

let updateInterval: ReturnType<typeof setInterval>;

const characteristicMock = ({
  value: new ArrayBuffer(1),
} as unknown) as Characteristic;

const subscriptionMock: Subscription = {
  remove: () => null,
};

const deviceMock = ({
  id: 'dummy-euc',
  name: 'Dummy EUC',
  connect: () => Promise.resolve(deviceMock),
  discoverAllServicesAndCharacteristics: () => Promise.resolve(deviceMock),
  readCharacteristicForService: () => Promise.resolve(characteristicMock),
  cancelConnection: () => Promise.resolve(deviceMock),
  isConnected: () => Promise.resolve(false),
  onDisconnected: () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    return subscriptionMock;
  },
  monitorCharacteristicForService: (
    _service: string,
    _characteristics: string,
    handleListening: (
      error: BleError | null,
      characteristic: Characteristic,
    ) => Subscription,
  ) => {
    updateInterval = setInterval(
      () => handleListening(null, characteristicMock),
      100,
    );

    return subscriptionMock;
  },
} as unknown) as Device;

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
      handle(null, deviceMock);
    },
    stopDeviceScan: () => null,
    remove: () => null,
  };

  return api;
};
