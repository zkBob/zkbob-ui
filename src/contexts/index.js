import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';
import SupportIdContext, { SupportIdContextProvider } from 'contexts/SupportIdContext';
import IncreasedLimitsContext, { IncreasedLimitsContextProvider } from 'contexts/IncreasedLimitsContext';
import PoolContext, { PoolContextProvider } from 'contexts/PoolContext';
import TokenPriceContext, { TokenPriceContextProvider } from 'contexts/TokenPriceContext';
import LanguageContext, { LanguageContextProvider } from 'contexts/LanguageContext';
import WalletContext, { WalletContextProvider } from 'contexts/WalletContext';

const ContextsProvider = ({ children }) => (
  <SupportIdContextProvider>
    <TransactionModalContextProvider>
      <ModalContextProvider>
        <PoolContextProvider>
          <WalletContextProvider>
            <TokenPriceContextProvider>
              <TokenBalanceContextProvider>
                <ZkAccountContextProvider>
                  <IncreasedLimitsContextProvider>
                    <LanguageContextProvider>
                      {children}
                    </LanguageContextProvider>
                  </IncreasedLimitsContextProvider>
                </ZkAccountContextProvider>
              </TokenBalanceContextProvider>
            </TokenPriceContextProvider>
          </WalletContextProvider>
        </PoolContextProvider>
      </ModalContextProvider>
    </TransactionModalContextProvider>
  </SupportIdContextProvider>
);

export default ContextsProvider;
export {
  ZkAccountContext, TokenBalanceContext, TransactionModalContext,
  ModalContext, SupportIdContext, IncreasedLimitsContext, PoolContext,
  TokenPriceContext, LanguageContext, WalletContext,
};
