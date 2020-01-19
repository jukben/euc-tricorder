import { NativeEventEmitter, NativeModules } from 'react-native';

const { PebbleClient } = NativeModules;

const pebbleClientEmitter = new NativeEventEmitter(PebbleClient);

export const createClient = () => {
  PebbleClient.configure('9151a02e-5cc5-4703-8c18-299482e00317');
  pebbleClientEmitter.addListener('PebbleConnected', watchName =>
    console.log(watchName),
  );
  PebbleClient.run();
};

export const sendUpdate = () => {
  PebbleClient.sendUpdate()
    .then(a => console.log('ok', a))
    .catch(b => console.log(b));
};
