import { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';

import { ZkAccountContext } from 'contexts';
import { useSelectedConnector } from 'hooks';
import AccountModal from 'components/AccountModal';

export default ({ isOpen, onClose, changeAccount, changeZkAccount }) => {
  const { account } = useWeb3React();
  const { zkAccount } = useContext(ZkAccountContext);
  const connector = useSelectedConnector();
  return (
    <AccountModal
      isOpen={isOpen}
      onClose={onClose}
      account={account}
      zkAccount={zkAccount}
      changeAccount={changeAccount}
      changeZkAccount={changeZkAccount}
      connector={connector}
    />
  );
}
