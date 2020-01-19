import { NativeEventEmitter, NativeModules } from 'react-native';

const { PebbleClient } = NativeModules;

const pebbleClientEmitter = new NativeEventEmitter(PebbleClient);

export const createClient = () => {
  PebbleClient.configure('281a8f21-594c-4cf2-a049-35a896ee8b27');
  pebbleClientEmitter.addListener('PebbleConnected', watchName =>
    console.log(watchName),
  );
  PebbleClient.run();
};

export const sendUpdate = (speed: number) => {
  PebbleClient.sendUpdate({
    speed,
  })
    .then(a => console.log('ok', a))
    .catch(b => console.log(b));
};
