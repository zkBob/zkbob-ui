import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useAccount } from 'wagmi';
import * as Sentry from '@sentry/react';

import { INCREASED_LIMITS_STATUSES } from 'constants';
import { PoolContext } from 'contexts';

const IncreasedLimitsContext = createContext({});

export default IncreasedLimitsContext;

export const IncreasedLimitsContextProvider = ({ children }) => {
  const { currentPool } = useContext(PoolContext);
  const { address } = useAccount();
  const [status, setStatus] = useState(null);

  const updateStatus = useCallback(async () => {
    if (!currentPool.kycUrls) {
      setStatus(null);
      return;
    }
    let status = INCREASED_LIMITS_STATUSES.INACTIVE;
    if (!address) {
      setStatus(status);
      return;
    }
    try {
      const data = await (
        await fetch(currentPool.kycUrls.status.replace('%s', address))
      ).json();
      const provider = data.data.providers.find(p => p.symbol === 'BABT');
      if (provider.result) {
        const syncData = provider.sync.byChainIds.find(c => c.chainId === currentPool.chainId);
        if (syncData.syncTimestamp === 0) {
          status = INCREASED_LIMITS_STATUSES.INACTIVE;
        } else if ((+new Date() / 1000) > syncData.expirationTimestamp) {
          status = INCREASED_LIMITS_STATUSES.RESYNC;
        } else {
          status = INCREASED_LIMITS_STATUSES.ACTIVE;
        }
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'IncreasedLimitsContext.check' } });
    }
    setStatus(status);
  }, [address, currentPool]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  return (
    <IncreasedLimitsContext.Provider value={{ status, updateStatus }}>
      {children}
    </IncreasedLimitsContext.Provider>
  );
};
