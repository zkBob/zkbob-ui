import { useContext } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';

import Button from 'components/Button';

export default () => {
  const { openAccountSetUpModal } = useContext(ModalContext);
  const { isLoadingZkAccount, loadingPercentage } = useContext(ZkAccountContext);
  let text = 'Get started!';
  if (isLoadingZkAccount) {
    text = loadingPercentage === null ? 'Loading zkAccount...' : `Downloading parameters: ${loadingPercentage}%`;
  }
  return (
    <Button
      $loading={isLoadingZkAccount}
      $contrast
      disabled={isLoadingZkAccount}
      onClick={openAccountSetUpModal}
    >
      {text}
    </Button>
  );
}
