import { useContext } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';

import Button from 'components/Button';

export default () => {
  const { openAccountSetUpModal } = useContext(ModalContext);
  const { isLoadingZkAccount } = useContext(ZkAccountContext);
  return (
    <Button
      $loading={isLoadingZkAccount}
      $contrast
      disabled={isLoadingZkAccount}
      onClick={openAccountSetUpModal}
    >
      {isLoadingZkAccount ? 'Loading...' : 'Get started!'}
    </Button>
  );
}
