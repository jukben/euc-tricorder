import { AdapterFactory } from '@euc-tricorder/adapters';
import React, { ReactChild, useContext, useMemo, useState } from 'react';

type TAdapter = ReturnType<AdapterFactory> | null;

type AdapterAPI = {
  adapter: TAdapter;
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
  value?: AdapterAPI['adapter'];
}) => {
  const [adapter, setAdapter] = useState<AdapterAPI['adapter']>(value);

  const api = useMemo(() => ({ adapter, setAdapter }), [adapter, setAdapter]);

  return (
    <AdapterContext.Provider value={api}>{children}</AdapterContext.Provider>
  );
};
