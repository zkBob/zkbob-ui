import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';
import TokenBalanceContext, { TokenBalanceContextProvider } from 'contexts/TokenBalanceContext';

const ContextsProvider = ({ children }) => (
  <ZkAccountContextProvider>
    <TokenBalanceContextProvider>
      {children}
    </TokenBalanceContextProvider>
  </ZkAccountContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext, TokenBalanceContext };
