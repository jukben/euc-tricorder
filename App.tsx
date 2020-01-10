import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import * as routes from './src/route';
import { Provider as PaperProvider } from 'react-native-paper';
import { Device } from 'react-native-ble-plx';
import { BleProvider } from './src/container';

type TStack = {
  Search: {};
  Connect: { device: Device };
};

export type TNavigatorProps<Route extends keyof TStack> = {
  navigation: StackNavigationProp<TStack>;
  route: { name: Route; params: TStack[Route] };
};

const Stack = createStackNavigator<TStack>();

function App() {
  return (
    <NavigationNativeContainer>
      <PaperProvider>
        <BleProvider>
          {/* Add logic for remembered devices */}
          <Stack.Navigator initialRouteName="Search">
            <Stack.Screen name="Search" component={routes.Search} />
            <Stack.Screen name="Connect" component={routes.Connect} />
          </Stack.Navigator>
        </BleProvider>
      </PaperProvider>
    </NavigationNativeContainer>
  );
}

export default App;
