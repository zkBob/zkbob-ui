import { useContext } from 'react';

import { TransactionModalContext } from 'contexts';
import TransactionModal from 'components/TransactionModal';

export default () => {
  const { txStatus, isTxModalOpen, closeTxModal } = useContext(TransactionModalContext);
  return (
    <TransactionModal
      isOpen={isTxModalOpen}
      onClose={closeTxModal}
      status={txStatus}
    />
  );
}
