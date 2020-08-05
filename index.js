import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import { LogBox } from 'react-native';

import { name as appName } from './app.json';
import { App } from './src/app';

/**
 * Hot fix for react-native-tts which sends events even though you don't listen for them
 */
LogBox.ignoreLogs([
  'Sending `tts',
  // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
  'Non-serializable values were found in the navigation state',
]);

AppRegistry.registerComponent(appName, () => App);
