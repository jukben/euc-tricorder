import { Device as BleDevice } from 'react-native-ble-plx';

import { createAdapter } from '../api';
import { KS_CHAR, KS_COMMANDS, KS_SERVICE } from './constants';
import { decodeData } from './utils';

const name = 'KingSong 18-XL';

const bleConfiguration = {
  service: KS_SERVICE,
  characteristic: KS_CHAR,
};

export const ks18xl = createAdapter(name, {
  bleConfiguration,
  getData: (bufferValue: ArrayBuffer) => {
    return decodeData(bufferValue);
  },
  afterConnect: (device: BleDevice) => {
    device.writeCharacteristicWithoutResponseForService(
      bleConfiguration.service,
      bleConfiguration.characteristic,
      KS_COMMANDS.REQUEST_NAME,
    );
  },
});
