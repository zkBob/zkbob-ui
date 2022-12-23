import { useContext } from 'react';

import { TransactionModalContext, SupportIdContext } from 'contexts';
import TransactionModal from 'components/TransactionModal';

export default () => {
  const {
    txStatus, isTxModalOpen, closeTxModal, txAmount, txError,
  } = useContext(TransactionModalContext);
  const { supportId } = useContext(SupportIdContext);
  return (
    <TransactionModal
      isOpen={isTxModalOpen}
      onClose={closeTxModal}
      status={txStatus}
      amount={txAmount}
      error={txError}
      supportId={supportId}
    />
  );
}
