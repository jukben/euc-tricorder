import {
  BLE_MOCK as _BLE_MOCK,
  FLIC_APP_KEY as _FLIC_APP_KEY,
  FLIC_APP_SECRET as _FLIC_APP_SECRET,
} from '@euc-tricorder/dotenv';

export const BLE_MOCK = _BLE_MOCK ? _BLE_MOCK.toLowerCase() === 'true' : false;

export const FLIC_APP_KEY = _FLIC_APP_KEY;
export const FLIC_APP_SECRET = _FLIC_APP_SECRET;
