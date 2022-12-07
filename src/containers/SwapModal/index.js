import { useContext, useState, useEffect } from 'react';

import { ModalContext } from 'contexts';
import LiFiWidget from 'containers/LiFiWidget';
import Modal from 'components/Modal';

export default () => {
  const { isSwapModalOpen, closeSwapModal } = useContext(ModalContext);
  const [isShown, setIsShown] = useState(true);
  useEffect(() => {
    if (!isSwapModalOpen) {
      // reset LiFi widget state
      setIsShown(false);
      setTimeout(() => setIsShown(true), 100);
    }
  }, [isSwapModalOpen]);
  return (
    <Modal
      isOpen={isShown}
      onClose={closeSwapModal}
      width={480}
      style={{ padding: '26px 0 0' }}
      containerStyle={{ display: isSwapModalOpen ? 'block' : 'none' }}
    >
      <LiFiWidget />
    </Modal>
  );
}
