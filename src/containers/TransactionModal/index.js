import { useContext } from 'react';

import { TransactionModalContext, SupportIdContext, PoolContext } from 'contexts';
import TransactionModal from 'components/TransactionModal';

export default () => {
  const {
    txStatus, isTxModalOpen, closeTxModal, txAmount, txError,
  } = useContext(TransactionModalContext);
  const { currentPool } = useContext(PoolContext);
  const { supportId } = useContext(SupportIdContext);
  return (
    <TransactionModal
      isOpen={isTxModalOpen}
      onClose={closeTxModal}
      status={txStatus}
      amount={txAmount}
      error={txError}
      supportId={supportId}
      currentPool={currentPool}
    />
  );
}
