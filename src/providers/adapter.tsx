import React, { useState, useContext, ReactChild } from 'react';
import { AdapterFactory } from '../adapters';

type TAdapter = ReturnType<AdapterFactory>;

type AdapterAPI = {
  adapter: TAdapter | null;
  setAdapter: (adapter: TAdapter) => void;
};

const AdapterContext = React.createContext<AdapterAPI | null>(null);

export const useAdapter = () => {
  const adapter = useContext(AdapterContext);

  if (!adapter) {
    throw Error('useAdapter has to be used within <AdapterProvider/>');
  }

  return adapter;
};

export const AdapterProvider = ({
  children,
  value = null,
}: {
  children: ReactChild | Array<ReactChild>;
  value: AdapterAPI['adapter'];
}) => {
  const [adapter, setAdapter] = useState<AdapterAPI['adapter']>(value);

  const api = { adapter, setAdapter };

  return (
    <AdapterContext.Provider value={api}>{children}</AdapterContext.Provider>
  );
};
