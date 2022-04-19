import { useContext } from 'react';

import { WalletModalContext, ZkAccountContext } from 'contexts';

import Button from 'components/Button';

export default () => {
  const { openAccountSetUpModal } = useContext(WalletModalContext);
  const { isLoadingZkAccount } = useContext(ZkAccountContext);
  const text = isLoadingZkAccount ? 'Loading zero knowledge account...' : 'Get started!';
  return <Button loading={isLoadingZkAccount} disabled={isLoadingZkAccount} onClick={openAccountSetUpModal}>{text}</Button>;
}
