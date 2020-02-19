import Config from 'react-native-config';

import { AdapterFactory } from './api';
import { dummyEUC } from './dummy';
import { ks18xl } from './ks';

export * from './api';

export const adapters = [ks18xl, Config.BLE_MOCK && dummyEUC].filter(
  Boolean,
) as Array<AdapterFactory>;
