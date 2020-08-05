import { AdapterID } from '@euc-tricorder/adapters';
import { useAlarm } from '@euc-tricorder/providers';
import { TTrip } from '@euc-tricorder/routes/home/device/overview/trip';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext } from 'react';
import { Device } from 'react-native-ble-plx';

type AlarmsSettings = ReturnType<typeof useAlarm>['data'];

export type TSettings = {
  device?: {
    id: Device['id'];
    adapter: AdapterID;
  };
  alarms?: AlarmsSettings;
  trip?: TTrip;
};

const api = {
  getSettingsForKey: async <T extends keyof TSettings>(id: T) => {
    const item = (await AsyncStorage.getItem(id)) as string;

    return JSON.parse(item) as Promise<TSettings[T]>;
  },
  setSettingsForKey: <T extends keyof TSettings>(id: T, value: TSettings[T]) =>
    AsyncStorage.setItem(id, JSON.stringify(value)) as Promise<void>,
  removeSettingsForKey: <T extends keyof TSettings>(id: T) =>
    AsyncStorage.removeItem(id) as Promise<void>,
} as const;

export type SettingsAPI = typeof api;

const SettingsContext = React.createContext<SettingsAPI>(api);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC = ({ children }) => {
  return (
    <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>
  );
};
