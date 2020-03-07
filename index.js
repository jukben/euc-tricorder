import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import { YellowBox } from 'react-native';

import { name as appName } from './app.json';
import { App } from './src/app';

/**
 * Hot fix for react-native-tts which sends events even though you don't listen for them
 */
YellowBox.ignoreWarnings(['Sending `tts']);

AppRegistry.registerComponent(appName, () => App);
