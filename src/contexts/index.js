import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';
import SupportIdContext, { SupportIdContextProvider } from 'contexts/SupportIdContext';

const ContextsProvider = ({ children }) => (
  <SupportIdContextProvider>
    <TransactionModalContextProvider>
      <ModalContextProvider>
        <TokenBalanceContextProvider>
          <ZkAccountContextProvider>
                {children}
          </ZkAccountContextProvider>
        </TokenBalanceContextProvider>
      </ModalContextProvider>
    </TransactionModalContextProvider>
  </SupportIdContextProvider>
);

export default ContextsProvider;
export {
  ZkAccountContext, TokenBalanceContext, TransactionModalContext,
  ModalContext, SupportIdContext,
};
