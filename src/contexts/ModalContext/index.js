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

  const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] = useState(false);
  const openConfirmLogoutModal = () => setIsConfirmLogoutModalOpen(true);
  const closeConfirmLogoutModal = () => setIsConfirmLogoutModalOpen(false);

  const [isSeedPhraseModalOpen, setIsSeedPhraseModalOpen] = useState(false);
  const openSeedPhraseModal = () => setIsSeedPhraseModalOpen(true);
  const closeSeedPhraseModal = () => setIsSeedPhraseModalOpen(false);

  const [isIncreasedLimitsModalOpen, setIsIncreasedLimitsModalOpen] = useState(false);
  const openIncreasedLimitsModal = () => setIsIncreasedLimitsModalOpen(true);
  const closeIncreasedLimitsModal = () => setIsIncreasedLimitsModalOpen(false);

  const [isRedeemGiftCardModalOpen, setIsRedeemGiftCardModalOpen] = useState(false);
  const openRedeemGiftCardModal = () => setIsRedeemGiftCardModalOpen(true);
  const closeRedeemGiftCardModal = () => setIsRedeemGiftCardModalOpen(false);

  const [isDisablePasswordModalOpen, setIsDisablePasswordModalOpen] = useState(false);
  const openDisablePasswordModal = () => setIsDisablePasswordModalOpen(true);
  const closeDisablePasswordModal = () => setIsDisablePasswordModalOpen(false);

  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const openNetworkDropdown = () => setIsNetworkDropdownOpen(true);
  const closeNetworkDropdown = () => setIsNetworkDropdownOpen(false);

  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const openWalletDropdown = () => setIsWalletDropdownOpen(true);
  const closeWalletDropdown = () => setIsWalletDropdownOpen(false);

  const [isZkAccountDropdownOpen, setIsZkAccountDropdownOpen] = useState(false);
  const openZkAccountDropdown = () => setIsZkAccountDropdownOpen(true);
  const closeZkAccountDropdown = () => setIsZkAccountDropdownOpen(false);

  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const openMoreDropdown = () => setIsMoreDropdownOpen(true);
  const closeMoreDropdown = () => setIsMoreDropdownOpen(false);

  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const openTokenSelector = () => setIsTokenSelectorOpen(true);
  const closeTokenSelector = () => setIsTokenSelectorOpen(false);

  const closeAllModals = () => {
    closeWalletModal();
    closeAccountSetUpModal();
    closeChangePasswordModal();
    closeSwapModal();
    closeConfirmLogoutModal();
    closeSeedPhraseModal();
    closeIncreasedLimitsModal();
    closeNetworkDropdown();
    closeWalletDropdown();
    closeZkAccountDropdown();
    closeMoreDropdown();
    closeTokenSelector();
  };

  return (
    <ModalContext.Provider
      value={{
        isWalletModalOpen, openWalletModal, closeWalletModal,
        isAccountSetUpModalOpen, openAccountSetUpModal, closeAccountSetUpModal,
        isPasswordModalOpen, openPasswordModal, closePasswordModal,
        isChangePasswordModalOpen, openChangePasswordModal, closeChangePasswordModal,
        isTermsModalOpen, openTermsModal, closeTermsModal,
        isSwapModalOpen, openSwapModal, closeSwapModal,
        isConfirmLogoutModalOpen, openConfirmLogoutModal, closeConfirmLogoutModal,
        isSeedPhraseModalOpen, openSeedPhraseModal, closeSeedPhraseModal,
        isIncreasedLimitsModalOpen, openIncreasedLimitsModal, closeIncreasedLimitsModal,
        isRedeemGiftCardModalOpen, openRedeemGiftCardModal, closeRedeemGiftCardModal,
        isDisablePasswordModalOpen, openDisablePasswordModal, closeDisablePasswordModal,
        isNetworkDropdownOpen, openNetworkDropdown, closeNetworkDropdown,
        isWalletDropdownOpen, openWalletDropdown, closeWalletDropdown,
        isZkAccountDropdownOpen, openZkAccountDropdown, closeZkAccountDropdown,
        isMoreDropdownOpen, openMoreDropdown, closeMoreDropdown,
        isTokenSelectorOpen, openTokenSelector, closeTokenSelector,
        closeAllModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
