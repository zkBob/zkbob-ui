import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const ZkAccountContext = createContext({ zkAccount: null });

export default ZkAccountContext;

export const ZkAccountContextProvider = ({ children }) => {
  const [zkAccount, setZkAccount] = useState(null);
  const loadZkAccount = useCallback(() => {
    const privateKey = window.localStorage.getItem('zkAccountKey');
    let zkAccount = null;
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey);
      zkAccount = wallet.address;
    }
    setZkAccount(zkAccount);
  }, []);
  useEffect(() => {
    loadZkAccount();
  }, [loadZkAccount]);
  const saveZkAccountKey = useCallback(privateKey => {
    window.localStorage.setItem('zkAccountKey', privateKey);
    loadZkAccount();
  }, [loadZkAccount]);
  return (
    <ZkAccountContext.Provider value={{ zkAccount, saveZkAccountKey }}>
      {children}
    </ZkAccountContext.Provider>
  );
};
