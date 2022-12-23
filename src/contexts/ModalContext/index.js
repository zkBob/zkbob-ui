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

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const openSwapModal = () => setIsSwapModalOpen(true);
  const closeSwapModal = () => setIsSwapModalOpen(false);

  const [isSuspiciousAddressModalOpen, setIsSuspiciousAddressModalOpen] = useState(false);
  const openSuspiciousAddressModal = () => setIsSuspiciousAddressModalOpen(true);
  const closeSuspiciousAddressModal = () => setIsSuspiciousAddressModalOpen(false);

  const [isSwapOptionsModalOpen, setIsSwapOptionsModalOpen] = useState(false);
  const openSwapOptionsModal = () => setIsSwapOptionsModalOpen(true);
  const closeSwapOptionsModal = () => setIsSwapOptionsModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isWalletModalOpen, openWalletModal, closeWalletModal,
        isAccountModalOpen, openAccountModal, closeAccountModal,
        isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
        isPasswordModalOpen, openPasswordModal, closePasswordModal,
        isChangePasswordModalOpen, openChangePasswordModal, closeChangePasswordModal,
        isTermsModalOpen, openTermsModal, closeTermsModal,
        isSwapModalOpen, openSwapModal, closeSwapModal,
        isSuspiciousAddressModalOpen, openSuspiciousAddressModal, closeSuspiciousAddressModal,
        isSwapOptionsModalOpen, openSwapOptionsModal, closeSwapOptionsModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
