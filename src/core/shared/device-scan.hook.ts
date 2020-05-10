import { useAdapter, useBle } from '@euc-tricorder/providers';
import { trackEvent } from 'appcenter-analytics';
import { useEffect, useState } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { Device } from 'react-native-ble-plx';

export const useDeviceScan = ({
  onDeviceFound,
}: {
  onDeviceFound: (device: Device) => void;
}) => {
  const { state, manager } = useBle();
  const { adapter } = useAdapter();
  const [appState, setAppState] = useState(AppState.currentState);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (appState !== 'active') {
      /**
       * startDeviceScan works only in foreground
       *
       * @see
       * https://github.com/Polidea/react-native-ble-plx/issues/669
       */
      return;
    }

    if (!manager) {
      return;
    }

    if (adapter?.isConnected()) {
      return;
    }

    console.log(`attempt to auto-connect... (${state})`);
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let timeoutUnsupported: ReturnType<typeof setTimeout> | null = null;

    if (state === 'Unsupported') {
      timeoutUnsupported = setTimeout(() => {
        Alert.alert("BLE doesn't respond", 'Please restart the application');
        trackEvent('ble state unsupported');
      }, 3000);
    }

    if (state === 'PoweredOn') {
      // don't report unsupported state since we have been able to connect
      timeoutUnsupported && clearTimeout(timeoutUnsupported);

      console.log('...auto-connecting...');
      /**
       * react-native-ble-plx has some problem if I call startDeviceScan
       * right in the moment Ble is ready (weird right?) so let's artificially
       * slow down a bit.
       *
       * This should be considered as hot fix, ideally it should be simply without
       * the timeout.
       */
      timeout = setTimeout(() => {
        manager.startDeviceScan(null, null, (error, bleDevice) => {
          if (error) {
            console.log(error);
            return;
          }

          if (bleDevice) {
            onDeviceFound(bleDevice);
          }
        });
      }, 1000);
    }

    return () => {
      manager.stopDeviceScan();
      timeout && clearTimeout(timeout);
      timeoutUnsupported && clearTimeout(timeoutUnsupported);
    };
  }, [manager, onDeviceFound, state, adapter, appState]);
};
