/* eslint-disable no-bitwise */

import { DeviceData } from '../api';

/**
 * This code is borrowed from @slastowski and the rest of the authors
 * @see https://github.com/slastowski/WheelLogAndroid/blob/master/app/src/main/java/com/cooper/wheellog/WheelData.java#L895
 */
export const decodeData = (buffer: ArrayBuffer): DeviceData | null => {
  const view = new DataView(buffer);

  const byteArrayInt2 = (low: number, high: number) => {
    return (low & 255) + (high & 255) * 256;
  };

  // live data
  if ((view.getUint8(16) & 255) === 169) {
    const speed = byteArrayInt2(view.getUint8(4), view.getUint8(5));
    const voltage = byteArrayInt2(view.getUint8(2), view.getUint8(3));
    const temperature = byteArrayInt2(view.getUint8(12), view.getUint8(13));
    const current = (view.getUint8(10) & 0xff) + (view.getUint8(11) << 8);

    // hard-coded for KS-18L
    let battery;
    if (voltage < 6000) {
      battery = 0;
    } else if (voltage >= 8400) {
      battery = 100;
    } else {
      battery = (voltage - 6000) / 24;
    }

    return {
      speed: speed / 100,
      voltage: voltage / 100,
      current: current / 100,
      temperature: temperature / 100,
      battery,
    };
  }

  return null;
};
