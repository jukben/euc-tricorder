// Type definitions for react-native-config
// author: @jukben
// Project: https://www.npmjs.com/package/react-native-config

// define the interface exactly for purpose of this project
declare module 'react-native-config' {
  export interface NativeConfig {
    FLIC_APP_KEY: string;
    FLIC_APP_SECRET: string;
    BLE_MOCK: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
