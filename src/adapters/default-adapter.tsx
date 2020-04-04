import { ExtractParameterType } from '@euc-tricorder/types';
import { trackEvent } from 'appcenter-analytics';
import { Buffer } from 'buffer';
import {
  Device as BleDevice,
  Subscription as BleSubscription,
} from 'react-native-ble-plx';

import { AdapterApi, AdapterID, AdapterService, DeviceData } from './api';

export type BleListener = ExtractParameterType<
  BleDevice['monitorCharacteristicForService'],
  2
>;

export type Listener = ExtractParameterType<AdapterService['handleData'], 0>;

export const defaultAdapter = (
  { device, name }: { device: BleDevice; name: AdapterID },
  configuration: AdapterApi,
): AdapterService => {
  let monitorSubscription: BleSubscription | null = null;
  let onDisconnectSubscription: BleSubscription | null = null;
  let listeners: Array<Listener> = [];

  const unsubscribe = () => {
    monitorSubscription && monitorSubscription.remove();
    onDisconnectSubscription && onDisconnectSubscription.remove();
    listeners = [];
  };

  const handleListening: BleListener = (error, characteristics) => {
    if (error) {
      return;
    }

    if (characteristics && characteristics.value) {
      const { value } = characteristics;
      const bufferValue = Buffer.from(value, 'base64').buffer;

      try {
        const data = configuration.getData(bufferValue);

        if (!data) {
          return;
        }

        listeners.forEach((listener) => {
          listener(data);
        });
      } catch (e) {
        trackEvent('adapter listening exception', {
          buffer: value,
        });
        console.error(e);
      }
    }
  };

  const handleDisconnect = (onDisconnect?: () => void) => () => {
    console.log('disconnect...');
    unsubscribe();
    onDisconnect && onDisconnect();
  };

  const testServicesAndCharacteristics = async () => {
    await device.connect();

    await device.discoverAllServicesAndCharacteristics();

    const { service, characteristic } = configuration.bleConfiguration;

    await device.readCharacteristicForService(service, characteristic);

    await device.cancelConnection();
  };

  const connect: AdapterService['connect'] = async (onDisconnect) => {
    if (await isConnected()) {
      console.log('already connected');
      return;
    }

    const { service, characteristic } = configuration.bleConfiguration;

    try {
      await device.connect();

      await device.discoverAllServicesAndCharacteristics();

      if (configuration.afterConnect) {
        configuration.afterConnect(device);
      }
    } catch (e) {
      await device.cancelConnection();
      throw e;
    }

    onDisconnectSubscription = device.onDisconnected(
      handleDisconnect(onDisconnect),
    );

    monitorSubscription = device.monitorCharacteristicForService(
      service,
      characteristic,
      handleListening,
    );
  };

  const disconnect: AdapterService['disconnect'] = async () => {
    unsubscribe();
    await device.cancelConnection();
  };

  const isConnected = () => device.isConnected();

  const handleData: AdapterService['handleData'] = (listener) => {
    const id = listeners.push(listener) - 1;

    return () => delete listeners[id];
  };

  const getName = () => device.name || name;

  const getId = () => device.id;

  const getAdapterName = () => name;

  return {
    getId,
    getName,
    getAdapterName,
    testServicesAndCharacteristics,
    connect,
    disconnect,
    isConnected,
    handleData,
  };
};
