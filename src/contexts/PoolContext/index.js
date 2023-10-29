import React, { createContext, useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { useLocation } from 'react-router-dom';

import config from 'config';

const PoolContext = createContext({ currentPool: null });

export default PoolContext;

export const PoolContextProvider = ({ children }) => {
  const location = useLocation();

  const [currentPool, setPool] = useState(() => {
    const savedPoolAlias = window.localStorage.getItem('pool');
    const alias = config.pools[savedPoolAlias] ? savedPoolAlias : config.defaultPool;
    return { ...config.pools[alias], alias };
  });

  const setCurrentPool = alias => {
    setPool({ ...config.pools[alias], alias });
    localStorage.setItem('pool', alias);
    Sentry.configureScope(scope => {
      scope.setTag('pool_id', alias);
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const poolInParams = queryParams.get('pool');
    const alias = Object.keys(config.pools).find(alias =>
      alias.toLowerCase() === poolInParams?.toLowerCase()
    );
    if (!alias) return;
    setCurrentPool(alias);
  }, [location.search]);

  return (
    <PoolContext.Provider value={{ currentPool, setCurrentPool }}>
      {children}
    </PoolContext.Provider>
  );
};
