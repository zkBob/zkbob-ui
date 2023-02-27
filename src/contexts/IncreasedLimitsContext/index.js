import { createContext, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import * as Sentry from '@sentry/react';

import { INCREASED_LIMITS_STATUSES } from 'constants';

const DAY = 86400; // in seconds

const IncreasedLimitsContext = createContext({});

export default IncreasedLimitsContext;

export const IncreasedLimitsContextProvider = ({ children }) => {
  const { address } = useAccount();
  const [status, setStatus] = useState(null);

  const updateStatus = useCallback(async () => {
    setStatus(null);
    if (!address || !process.env.REACT_APP_KYC_STATUS_URL) return;
    let status = null;
    try {
      const data = await (
        await fetch(process.env.REACT_APP_KYC_STATUS_URL.replace('%s', address))
      ).json();
      const provider = data.data.providers.find(p => p.symbol === 'BABT');
      if (!provider.result) {
        status = INCREASED_LIMITS_STATUSES.INACTIVE;
      } else {
        const syncData = provider.sync.byChainIds.find(
          c => c.chainId === Number(process.env.REACT_APP_NETWORK)
        );
        if (syncData.syncTimestamp === 0) {
          status = INCREASED_LIMITS_STATUSES.INACTIVE;
        } else if ((+new Date() / 1000) - syncData.syncTimestamp > 7 * DAY) {
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
  }, [address]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  return (
    <IncreasedLimitsContext.Provider value={{ status, updateStatus }}>
      {children}
    </IncreasedLimitsContext.Provider>
  );
};
