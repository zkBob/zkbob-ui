import React, { createContext, useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';

import config from 'config';

const PoolContext = createContext({ currentPool: null });

export default PoolContext;

export const PoolContextProvider = ({ children }) => {
  const [currentPool, setPool] = useState(() => {
    const savedPoolAlias = window.localStorage.getItem('pool');
    const alias = config.pools[savedPoolAlias] ? savedPoolAlias : config.defaultPool;
    return { ...config.pools[alias], alias };
  });

  const setCurrentPool = useCallback(alias => {
    setPool({ ...config.pools[alias], alias });
    localStorage.setItem('pool', alias);
    Sentry.configureScope(scope => {
      scope.setTag('pool_id', alias);
    });
  }, []);

  return (
    <PoolContext.Provider value={{ currentPool, setCurrentPool }}>
      {children}
    </PoolContext.Provider>
  );
};
