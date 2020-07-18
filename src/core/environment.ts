import Config from 'react-native-config';

export const BLE_MOCK = Config.BLE_MOCK
  ? Config.BLE_MOCK.toLowerCase() === 'true'
  : false;

export const FLIC_APP_KEY = Config.FLIC_APP_KEY;
export const FLIC_APP_SECRET = Config.FLIC_APP_SECRET;
