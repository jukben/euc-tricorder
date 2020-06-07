import { Buffer } from 'buffer';

export const KS_OBSERVABLE_SERVICE = '0000fff0-0000-1000-8000-00805f9b34fb';
export const KS_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
export const KS_CHAR = '0000ffe1-0000-1000-8000-00805f9b34fb';

export const KS_COMMANDS = {
  REQUEST_NAME: Buffer.from(
    new Int8Array([
      -86,
      85,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      -101,
      20,
      90,
      90,
    ]),
  ).toString('base64'),
} as const;
