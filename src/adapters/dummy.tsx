import { createAdapter, DeviceData } from './api';

const name = 'Dummy EUC';

let dummyData = {
  battery: 90,
  speed: 20,
  temperature: 10,
  current: 10,
  voltage: 72,
};

function updateData(prevData: DeviceData): DeviceData {
  return {
    ...prevData,
    speed: Math.random() * 30 + 10,
  };
}

export const dummyEUC = createAdapter(name, {
  bleConfiguration: {
    characteristic: '',
    service: '',
  },
  getData: () => {
    dummyData = updateData(dummyData);

    return dummyData;
  },
});
