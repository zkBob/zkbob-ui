import React, { createContext, useState, useCallback } from 'react';

const TransactionModalContext = createContext({ txStatus: null, setTxStatus: () => {} });

export default TransactionModalContext;

export const TransactionModalContextProvider = ({ children }) => {
  const [txStatus, setTxStatus] = useState(null);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const openTxModal = useCallback(() => {
    setIsTxModalOpen(true);
  }, []);
  const closeTxModal = useCallback(() => {
    setIsTxModalOpen(false);
    setTxStatus(null);
  }, []);
  return (
    <TransactionModalContext.Provider value={{ txStatus, setTxStatus, isTxModalOpen, openTxModal, closeTxModal }}>
      {children}
    </TransactionModalContext.Provider>
  );
};
