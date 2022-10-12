import React, { createContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';

const TransactionModalContext = createContext({ txStatus: null, setTxStatus: () => {} });

export default TransactionModalContext;

export const TransactionModalContextProvider = ({ children }) => {
  const [txStatus, setTxStatus] = useState(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txAmount, setTxAmount] = useState(ethers.constants.Zero);
  const openTxModal = useCallback(() => {
    setIsTxModalOpen(true);
  }, []);
  const closeTxModal = useCallback(() => {
    setIsTxModalOpen(false);
    setTxStatus(null);
    setTxAmount(ethers.constants.Zero);
  }, []);
  return (
    <TransactionModalContext.Provider
      value={{ txStatus, setTxStatus, isTxModalOpen, openTxModal, closeTxModal, txAmount, setTxAmount }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
