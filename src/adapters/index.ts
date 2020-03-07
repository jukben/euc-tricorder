import { BLE_MOCK } from '@euc-tricorder/core';

import { AdapterFactory } from './api';
import { dummyEUC } from './dummy';
import { ks18xl } from './ks';

export * from './api';

export const adapters = [ks18xl, BLE_MOCK && dummyEUC].filter(Boolean) as Array<
  AdapterFactory
>;
