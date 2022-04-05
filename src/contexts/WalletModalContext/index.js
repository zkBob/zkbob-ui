import React, { createContext, useState } from 'react';

const WalletModalContext = createContext({ txStatus: null, setTxStatus: () => {} });

export default WalletModalContext;

export const WalletModalContextProvider = ({ children }) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const [isAccountSetUpModalOpen, setIsAccountSetUpModalOpen] = useState(false);
  const openAccountSetUpModal = () => setIsAccountSetUpModalOpen(true);
  const closeAccountSetUpModal = () => setIsAccountSetUpModalOpen(false);

  return (
    <WalletModalContext.Provider
      value={{
        isWalletModalOpen, openWalletModal, closeWalletModal,
        isAccountModalOpen, openAccountModal, closeAccountModal,
        isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
      }}
    >
      {children}
    </WalletModalContext.Provider>
  );
};
