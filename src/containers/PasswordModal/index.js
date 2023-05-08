import { useContext, useState, useCallback, useEffect } from 'react';

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
  const [attempt, setAttempt] = useState(0);

  const handlePasswordChange = useCallback(e => {
    setError(null);
    setPassword(e.target.value);
  }, []);

  const confirm = useCallback(() => {
    try {
      const success = unlockAccount(password);
      if (success) {
        setPassword('');
        setAttempt(0);
      } else {
        setAttempt(prev => prev + 1);
      }
    } catch (error) {
      setError(error);
      setAttempt(0);
    }
  }, [password, unlockAccount]);

  useEffect(() => {
    if (attempt > 0) {
      setTimeout(confirm, 500);
    }
  }, [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

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
      isLoading={attempt > 0}
    />
  );
}
