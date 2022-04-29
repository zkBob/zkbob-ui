import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';

const ContextsProvider = ({ children }) => (
  <TransactionModalContextProvider>
    <ModalContextProvider>
      <TokenBalanceContextProvider>
        <ZkAccountContextProvider>
              {children}
        </ZkAccountContextProvider>
      </TokenBalanceContextProvider>
    </ModalContextProvider>
  </TransactionModalContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext, TokenBalanceContext, TransactionModalContext, ModalContext };
