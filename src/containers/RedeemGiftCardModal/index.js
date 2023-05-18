import { useContext, useEffect, useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ModalContext, PoolContext, ZkAccountContext, SupportIdContext } from 'contexts';
import RedeemGiftCardModal from 'components/RedeemGiftCardModal';

export default () => {
  const { currentPool } = useContext(PoolContext);
  const {
    giftCard, initializeGiftCard, deleteGiftCard,
    redeemGiftCard, switchToPool, zkAccount, isLoadingZkAccount,
  } = useContext(ZkAccountContext);
  const {
    isRedeemGiftCardModalOpen,
    openRedeemGiftCardModal,
    closeRedeemGiftCardModal,
    isPasswordModalOpen,
    isAccountSetUpModalOpen,
    openAccountSetUpModal,
    isTermsModalOpen,
  } = useContext(ModalContext);
  const { supportId } = useContext(SupportIdContext);
  const history = useHistory();
  const location = useLocation();
  const [giftCode, setGiftCode] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if ((giftCode || giftCard) && !isPasswordModalOpen && !isAccountSetUpModalOpen && !isTermsModalOpen) {
      openRedeemGiftCardModal();
    }
  }, [
    giftCode, giftCard, openRedeemGiftCardModal, isPasswordModalOpen,
    isAccountSetUpModalOpen, isTermsModalOpen,
  ]);

  useEffect(() => {
    async function init(code) {
      if (!window.localStorage.getItem('seed')) {
        setIsNewUser(true);
      }
      setGiftCode(code);
      queryParams.delete('gift-code');
      history.replace({ search: queryParams.toString() });
    }
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('gift-code');
    if (code) init(code);
  }, [history, location, initializeGiftCard]);

  useEffect(() => {
    async function init() {
      const result = await initializeGiftCard(giftCode);
      if (result) setGiftCode(null);
    }
    if (giftCode) init();
  }, [giftCode, initializeGiftCard]);

  const onClose = useCallback(() => {
    deleteGiftCard();
    closeRedeemGiftCardModal();
  }, [deleteGiftCard, closeRedeemGiftCardModal]);

  const setUpAccount = useCallback(() => {
    closeRedeemGiftCardModal();
    openAccountSetUpModal();
  }, [closeRedeemGiftCardModal, openAccountSetUpModal]);

  return (
    <RedeemGiftCardModal
      isOpen={isRedeemGiftCardModalOpen}
      onClose={onClose}
      giftCard={giftCard}
      redeemGiftCard={redeemGiftCard}
      zkAccount={zkAccount}
      isLoadingZkAccount={isLoadingZkAccount}
      currentPool={currentPool}
      switchToPool={switchToPool}
      setUpAccount={setUpAccount}
      isNewUser={isNewUser}
      supportId={supportId}
    />
  );
}
