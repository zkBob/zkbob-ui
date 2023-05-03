import { useContext, useState, useCallback } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';
import PasswordModal from 'components/PasswordModal';

export default () => {
  const {
    isPasswordModalOpen,
    openAccountSetUpModal,
    isAccountSetUpModalOpen,
  } = useContext(ModalContext);
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
      setPassword('');
    } catch (error) {
      setError(error);
    }
  }, [password, unlockAccount]);

  const reset = useCallback(async () => {
    setPassword('');
    openAccountSetUpModal();
  }, [openAccountSetUpModal]);

  return (
    <PasswordModal
      isOpen={isPasswordModalOpen}
      password={password}
      onPasswordChange={handlePasswordChange}
      confirm={confirm}
      reset={reset}
      error={error}
      isAccountSetUpModalOpen={isAccountSetUpModalOpen}
    />
  );
}
