import { useContext, useState, useCallback } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';
import PasswordModal from 'components/PasswordModal';

export default () => {
  const { isPasswordModalOpen, closePasswordModal, openAccountSetUpModal } = useContext(ModalContext);
  const { unlockAccount } = useContext(ZkAccountContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const handlePasswordChange = useCallback(e => {
    setError(null);
    setPassword(e.target.value);
  }, []);
  const confirm = useCallback(async () => {
    try {
      await unlockAccount(password);
    } catch (error) {
      setError(error);
    }
  }, [password]);
  const reset = useCallback(async () => {
    closePasswordModal();
    openAccountSetUpModal();
  });
  return (
    <PasswordModal
      isOpen={isPasswordModalOpen}
      password={password}
      onPasswordChange={handlePasswordChange}
      confirm={confirm}
      reset={reset}
      error={error}
    />
  );
}
