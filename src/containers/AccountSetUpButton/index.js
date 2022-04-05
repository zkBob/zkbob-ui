import { useContext } from 'react';

import { WalletModalContext } from 'contexts';

import Button from 'components/Button';

export default () => {
  const { openAccountSetUpModal } = useContext(WalletModalContext);
  return <Button onClick={openAccountSetUpModal}>Set up zero knowledge account</Button>;
}
