import { BleAPI } from '../container';

type TAdapter = (
  bleApi: BleAPI,
) => {
  connect: () => void;
};

export const createAdapter = (name: string, adapter: TAdapter) => {
  const adapterFactory = (bleApi: BleAPI) => adapter(bleApi);

  adapterFactory.name = name;

  return adapterFactory;
};
