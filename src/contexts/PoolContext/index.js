import React, { createContext, useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';

import config from 'config';

const PoolContext = createContext({ currentPool: null });

export default PoolContext;

export const PoolContextProvider = ({ children }) => {
  const [currentPool, setPool] = useState(() => {
    const poolId = window.localStorage.getItem('pool');
    return !!config.pools[poolId] ? poolId : config.defaultPool;
  });

  const setCurrentPool = useCallback(poolId => {
    setPool(poolId);
    localStorage.setItem('pool', poolId);
    Sentry.configureScope(scope => {
      scope.setTag('pool_id', poolId);
    });
  }, []);

  return (
    <PoolContext.Provider value={{ currentPool, setCurrentPool }}>
      {children}
    </PoolContext.Provider>
  );
};
