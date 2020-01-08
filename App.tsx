import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, StatusBar, TouchableOpacity } from 'react-native';
import {
  BleManager,
  Device,
  BleError,
  Characteristic,
} from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const KS_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
const KS_CHAR = '0000ffe1-0000-1000-8000-00805f9b34fb';

const Connect = ({ device }: { device: Device }) => {
  const listener = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log('error', error);
      return;
    }

    if (characteristic) {
      console.log('logs', characteristic);
    }
  };

  const handlePress = async () => {
    console.log('connecting to', device.name);
    const requestName = Buffer.from(
      new Int8Array([
        -86,
        85,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -101,
        20,
        90,
        90,
      ]),
    ).toString('base64');

    console.log('connect');

    await device.connect();
    console.log('subscription');

    await device.discoverAllServicesAndCharacteristics();

    const subscription = device.monitorCharacteristicForService(
      KS_SERVICE,
      KS_CHAR,
      listener,
    );

    console.log('write');
    device.writeCharacteristicWithoutResponseForService(
      KS_SERVICE,
      KS_CHAR,
      requestName,
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>Connect</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const BLEref = useRef<BleManager>(null);
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    // @ts-ignore
    BLEref.current = new BleManager();
  }, []);

  const scan = () => {
    if (device) {
      return;
    }

    const mujSwag = (error: BleError | null, device: Device | null) => {
      if (error) {
        console.log(error);
        // Handle error (scanning will be stopped automatically)
        return;
      }

      if (device && device.name === 'KS-18L-21593') {
        console.log(device);
        setDevice(device);
        BLEref.current?.stopDeviceScan();
      }
    };

    BLEref.current?.startDeviceScan(null, null, mujSwag);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {device ? (
          <>
            <Text>{device.name}</Text>
            <Connect device={device} />
          </>
        ) : (
          <TouchableOpacity onPress={scan}>
            <Text>Find wheel</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

export default App;
