import { BleAPI } from '../../providers';
import { createAdapter } from '../api';

export const ks18xl = createAdapter('KingSong 18-XL', (_bleApi: BleAPI) => {
  const connect = () => {
    console.log('do connect');
  };

  return {
    connect,
  };
});
