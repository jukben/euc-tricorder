/* eslint-disable no-bitwise */
import { DeviceData } from '../api';

const byteArrayInt2 = (low: number, high: number) => {
  return (low & 255) + (high & 255) * 256;
};

const byteArrayInt4 = (
  value1: number,
  value2: number,
  value3: number,
  value4: number,
) => {
  return (
    ((value1 & 255) << 16) |
    ((value2 & 255) << 24) |
    (value3 & 255) |
    ((value4 & 255) << 8)
  );
};

/**
 * This code is borrowed from @slastowski and the rest of the authors
 * @see https://github.com/slastowski/WheelLogAndroid/blob/master/app/src/main/java/com/cooper/wheellog/WheelData.java#L895
 */
export const decodeData = (buffer: ArrayBuffer): DeviceData | null => {
  const view = new DataView(buffer);

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

    const totalDistance = byteArrayInt4(
      view.getUint8(6),
      view.getUint8(7),
      view.getUint8(8),
      view.getUint8(9),
    );

    return {
      speed: speed / 100,
      voltage: voltage / 100,
      current: current / 100,
      temperature: temperature / 100,
      battery,
      totalDistance,
    };
  } else if ((view.getUint8(16) & 255) === 185) {
    const currentDistance = byteArrayInt4(
      view.getUint8(2),
      view.getUint8(3),
      view.getUint8(4),
      view.getUint8(5),
    );

    // I have no idea why there have to be "2". I just measured the difference. 🤷
    const deviceUptime = byteArrayInt2(view.getUint8(6), view.getUint8(7)) * 2;

    return {
      currentDistance,
      deviceUptime,
    };
  }

  return null;
};
