import React, { createContext, useState } from 'react';

const ModalContext = createContext({});

export default ModalContext;

export const ModalContextProvider = ({ children }) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

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

  const [isSwapOptionsModalOpen, setIsSwapOptionsModalOpen] = useState(false);
  const openSwapOptionsModal = () => setIsSwapOptionsModalOpen(true);
  const closeSwapOptionsModal = () => setIsSwapOptionsModalOpen(false);

  const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] = useState(false);
  const openConfirmLogoutModal = () => setIsConfirmLogoutModalOpen(true);
  const closeConfirmLogoutModal = () => setIsConfirmLogoutModalOpen(false);

  const [isSeedPhraseModalOpen, setIsSeedPhraseModalOpen] = useState(false);
  const openSeedPhraseModal = () => setIsSeedPhraseModalOpen(true);
  const closeSeedPhraseModal = () => setIsSeedPhraseModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isWalletModalOpen, openWalletModal, closeWalletModal,
        isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
        isPasswordModalOpen, openPasswordModal, closePasswordModal,
        isChangePasswordModalOpen, openChangePasswordModal, closeChangePasswordModal,
        isTermsModalOpen, openTermsModal, closeTermsModal,
        isSwapModalOpen, openSwapModal, closeSwapModal,
        isSwapOptionsModalOpen, openSwapOptionsModal, closeSwapOptionsModal,
        isConfirmLogoutModalOpen, openConfirmLogoutModal, closeConfirmLogoutModal,
        isSeedPhraseModalOpen, openSeedPhraseModal, closeSeedPhraseModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
