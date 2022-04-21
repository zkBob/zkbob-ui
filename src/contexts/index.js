import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';

const ContextsProvider = ({ children }) => (
  <TransactionModalContextProvider>
    <ModalContextProvider>
      <ZkAccountContextProvider>
        <TokenBalanceContextProvider>
            {children}
        </TokenBalanceContextProvider>
      </ZkAccountContextProvider>
    </ModalContextProvider>
  </TransactionModalContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext, TokenBalanceContext, TransactionModalContext, ModalContext };
