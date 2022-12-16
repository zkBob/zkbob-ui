import { createContext, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import checkSuspiciousAddress from 'utils/checkSuspiciousAddress';

const WalletScreeningContext = createContext({ isSuspiciousAddress: false, checkedAddress: null });

export default WalletScreeningContext;

export const WalletScreeningContextProvider = ({ children }) => {
  const { account } = useWeb3React();
  const [isSuspiciousAddress, setIsSuspiciousAddress] = useState(false);
  const [checkedAddress, setCheckedAddress] = useState(null);

  useEffect(() => {
    async function check() {
      let isSuspiciousAddress = false;
      let checkedAddress = null;
      if (account) {
        isSuspiciousAddress = await checkSuspiciousAddress(account);
        checkedAddress = account;
      }
      setIsSuspiciousAddress(isSuspiciousAddress);
      setCheckedAddress(checkedAddress);
    }
    check();
  }, [account]);

  return (
    <WalletScreeningContext.Provider value={{ isSuspiciousAddress, checkedAddress }}>
      {children}
    </WalletScreeningContext.Provider>
  );
};
