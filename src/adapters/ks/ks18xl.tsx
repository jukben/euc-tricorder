import { BleAPI } from '../../container';
import { createAdapter } from '../base';

export const adapter = createAdapter('KingSong 18-XL', (_bleApi: BleAPI) => {
  const connect = () => {
    console.log('do connect');
  };

  return {
    connect,
  };
});
