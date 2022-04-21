import React, { createContext, useState } from 'react';

const ModalContext = createContext({});

export default ModalContext;

export const ModalContextProvider = ({ children }) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const [isAccountSetUpModalOpen, setIsAccountSetUpModalOpen] = useState(false);
  const openAccountSetUpModal = () => setIsAccountSetUpModalOpen(true);
  const closeAccountSetUpModal = () => setIsAccountSetUpModalOpen(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isWalletModalOpen, openWalletModal, closeWalletModal,
        isAccountModalOpen, openAccountModal, closeAccountModal,
        isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
        isPasswordModalOpen, openPasswordModal, closePasswordModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
