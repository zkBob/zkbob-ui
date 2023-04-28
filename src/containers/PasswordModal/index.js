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
      const success = await unlockAccount(password);
      if (success) {
        setPassword('');
      }
    } catch (error) {
      setError(error);
    }
  }, [password, unlockAccount]);
  const reset = useCallback(async () => {
    setPassword('');
    closePasswordModal();
    openAccountSetUpModal();
  }, [closePasswordModal, openAccountSetUpModal]);
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
