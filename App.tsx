import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, StatusBar } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const mujSwag = (e, lol) => console.log(e);

const App = () => {
  const BLEref = useRef<typeof BleManager>(null);

  useEffect(() => {
    // @ts-ignore
    BLEref.current = new BleManager();
  }, []);

  const scan = () => {
    console.log(BLEref.current);
    BLEref.current.startDeviceScan(null, null, mujSwag);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text onPress={scan}>Ahoj</Text>
      </SafeAreaView>
    </>
  );
};

export default App;
