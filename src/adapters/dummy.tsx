import { createAdapter, DeviceData } from './api';

const name = 'Dummy EUC';

let dummyData = {
  battery: 90,
  speed: 20,
  temperature: 10,
  current: 10,
  voltage: 72,
  totalDistance: 300000,
  currentDistance: 123,
};

const maxSpeed = 10;
const minSpeed = 0;
let curSpeed = 0;
let direction: 'up' | 'down' = 'up';

function updateData(prevData: DeviceData): DeviceData {
  // speed mock, kinda lol
  if (direction === 'up') {
    curSpeed++;
    if (curSpeed === maxSpeed) {
      direction = 'down';
    }
  } else if (direction === 'down') {
    curSpeed--;
    if (curSpeed === minSpeed) {
      direction = 'up';
    }
  }

  return {
    ...prevData,
    speed: curSpeed,
  };
}

export const dummyEUC = createAdapter(name, {
  bleConfiguration: {
    characteristic: '',
    service: '',
  },
  getData: () => {
    return updateData(dummyData);
  },
});
