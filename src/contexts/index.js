import React from 'react';

import ZkAccountContext, { ZkAccountContextProvider } from 'contexts/ZkAccountContext';

const ContextsProvider = ({ children }) => (
  <ZkAccountContextProvider>
    {children}
  </ZkAccountContextProvider>
);

export default ContextsProvider;
export { ZkAccountContext };
