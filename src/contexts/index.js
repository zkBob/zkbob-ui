import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';

const ContextsProvider = ({ children }) => (
  <TransactionModalContextProvider>
    <ZkAccountContextProvider>
      <TokenBalanceContextProvider>
          {children}
      </TokenBalanceContextProvider>
    </ZkAccountContextProvider>
  </TransactionModalContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext, TokenBalanceContext, TransactionModalContext };
