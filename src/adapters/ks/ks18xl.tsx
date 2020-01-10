import { createAdapter } from '../api';

export const ks18xl = createAdapter('KingSong 18-XL', (_device, _bleApi) => {
  const connect = async () => {
    console.log('do connect');
  };

  return {
    connect,
  };
});
