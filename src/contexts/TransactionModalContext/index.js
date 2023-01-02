import React, { createContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';

const TransactionModalContext = createContext({ txStatus: null, setTxStatus: () => {} });

export default TransactionModalContext;

export const TransactionModalContextProvider = ({ children }) => {
  const [txStatus, setTxStatus] = useState(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txAmount, setTxAmount] = useState(ethers.constants.Zero);
  const [txError, setTxError] = useState(null);
  const openTxModal = useCallback(() => {
    setIsTxModalOpen(true);
  }, []);
  const closeTxModal = useCallback(() => {
    setIsTxModalOpen(false);
    setTxStatus(null);
    setTxAmount(ethers.constants.Zero);
    setTxError(null);
  }, []);
  return (
    <TransactionModalContext.Provider
      value={{
        txStatus, setTxStatus,
        isTxModalOpen, openTxModal, closeTxModal,
        txAmount, setTxAmount,
        txError, setTxError,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};
