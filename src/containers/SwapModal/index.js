import { useContext } from 'react';

import { ModalContext } from 'contexts';
import LiFiWidget from 'containers/LiFiWidget';
import Modal from 'components/Modal';

export default () => {
  const { isSwapModalOpen, closeSwapModal } = useContext(ModalContext);
  return (
    <Modal
      isOpen={isSwapModalOpen}
      onClose={closeSwapModal}
      width={480}
      style={{ padding: '26px 0 0' }}
    >
      <LiFiWidget />
    </Modal>
  );
}
