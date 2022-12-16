import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';
import WalletScreeningContext, { WalletScreeningContextProvider } from 'contexts/WalletScreeningContext';

const ContextsProvider = ({ children }) => (
  <TransactionModalContextProvider>
    <ModalContextProvider>
      <WalletScreeningContextProvider>
        <TokenBalanceContextProvider>
          <ZkAccountContextProvider>
                {children}
          </ZkAccountContextProvider>
        </TokenBalanceContextProvider>
      </WalletScreeningContextProvider>
    </ModalContextProvider>
  </TransactionModalContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext, TokenBalanceContext, TransactionModalContext, ModalContext, WalletScreeningContext };
