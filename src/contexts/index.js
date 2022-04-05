import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import WalletModalContext, { WalletModalContextProvider } from 'contexts/WalletModalContext';

const ContextsProvider = ({ children }) => (
  <TransactionModalContextProvider>
    <ZkAccountContextProvider>
      <TokenBalanceContextProvider>
        <WalletModalContextProvider>
          {children}
        </WalletModalContextProvider>
      </TokenBalanceContextProvider>
    </ZkAccountContextProvider>
  </TransactionModalContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext, TokenBalanceContext, TransactionModalContext, WalletModalContext };
