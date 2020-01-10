import React, { useState, useContext } from 'react';
import { createAdapter } from '../adapters';

type TAdapter = ReturnType<ReturnType<typeof createAdapter>>;

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

export const AdapterProvider: React.FC = ({ children }) => {
  const [adapter, setAdapter] = useState<AdapterAPI['adapter']>(null);

  const api = { adapter, setAdapter };

  return (
    <AdapterContext.Provider value={api}>{children}</AdapterContext.Provider>
  );
};
