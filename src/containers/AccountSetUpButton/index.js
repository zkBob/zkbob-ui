import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ModalContext, ZkAccountContext } from 'contexts';

import Button from 'components/Button';

export default () => {
  const { t } = useTranslation();
  const { openAccountSetUpModal } = useContext(ModalContext);
  const { isLoadingZkAccount } = useContext(ZkAccountContext);
  return (
    <Button
      loading={isLoadingZkAccount}
      contrast
      disabled={isLoadingZkAccount}
      onClick={openAccountSetUpModal}
      data-ga-id="zkaccount-get-started"
    >
      {isLoadingZkAccount ? t('buttonText.loading') : t('buttonText.getStarted')}
    </Button>
  );
}
