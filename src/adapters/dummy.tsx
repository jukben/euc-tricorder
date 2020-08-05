import { createAdapter, DeviceData } from './api';

const name = 'Dummy EUC';

let dummyData = {
  battery: 90,
  speed: 20,
  temperature: 10,
  current: 10,
  voltage: 72,
  totalDistance: 300000,
  currentDistance: 0,
};

const maxSpeed = 10;
let curSpeed = 0;

function updateData(prevData: DeviceData): DeviceData {
  // speed mock, kinda lol
  curSpeed += 0.1;

  const addDistance = (number?: number) => (number ? number + 100 : 100);

  return {
    ...prevData,
    speed: Math.round(Math.sin(curSpeed % 1) * maxSpeed),
    currentDistance: addDistance(prevData.currentDistance),
    totalDistance: addDistance(prevData.totalDistance),
  };
}

export const dummyEUC = createAdapter(name, {
  bleConfiguration: {
    characteristic: '',
    service: '',
  },
  getData: () => {
    dummyData = { ...dummyData, ...updateData(dummyData) };

    return dummyData;
  },
});
