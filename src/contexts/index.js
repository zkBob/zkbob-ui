import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';
import SupportIdContext, { SupportIdContextProvider } from 'contexts/SupportIdContext';
import IncreasedLimitsContext, { IncreasedLimitsContextProvider } from 'contexts/IncreasedLimitsContext';
import PoolContext, { PoolContextProvider } from 'contexts/PoolContext';

const ContextsProvider = ({ children }) => (
  <SupportIdContextProvider>
    <TransactionModalContextProvider>
      <ModalContextProvider>
        <PoolContextProvider>
          <TokenBalanceContextProvider>
            <ZkAccountContextProvider>
              <IncreasedLimitsContextProvider>
                {children}
              </IncreasedLimitsContextProvider>
            </ZkAccountContextProvider>
          </TokenBalanceContextProvider>
        </PoolContextProvider>
      </ModalContextProvider>
    </TransactionModalContextProvider>
  </SupportIdContextProvider>
);

export default ContextsProvider;
export {
  ZkAccountContext, TokenBalanceContext, TransactionModalContext,
  ModalContext, SupportIdContext, IncreasedLimitsContext, PoolContext,
};
