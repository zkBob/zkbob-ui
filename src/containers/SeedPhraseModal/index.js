import { useContext, useState, useCallback, useEffect } from 'react';

import { ModalContext, ZkAccountContext } from 'contexts';
import SeedPhraseModal from 'components/SeedPhraseModal';

export default () => {
  const { isSeedPhraseModalOpen, closeSeedPhraseModal } = useContext(ModalContext);
  const { decryptMnemonic, getSeed } = useContext(ZkAccountContext);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState(null);
  const [error, setError] = useState(null);

  const { seed, hasPassword } = getSeed();

  useEffect(() => {
    if (isSeedPhraseModalOpen && seed && !hasPassword) {
      setMnemonic(seed);
    }
  }, [seed, hasPassword, isSeedPhraseModalOpen]);

  const handlePasswordChange = useCallback(e => {
    setError(null);
    setPassword(e.target.value);
  }, []);

  const confirm = useCallback(async () => {
    try {
      const mnemonic = await decryptMnemonic(password);
      setMnemonic(mnemonic);
    } catch (error) {
      setError(error);
    }
  }, [password, decryptMnemonic]);

  const handleKeyPress = useCallback(event => {
    if(event.key === 'Enter'){
      confirm();
    }
  }, [confirm]);

  const onClose = useCallback(() => {
    closeSeedPhraseModal();
    setPassword('');
    setMnemonic(null);
    setError(null);
  }, [closeSeedPhraseModal]);

  return (
    <SeedPhraseModal
      isOpen={isSeedPhraseModalOpen}
      onClose={onClose}
      confirm={confirm}
      onPasswordChange={handlePasswordChange}
      onKeyPress={handleKeyPress}
      password={password}
      error={error}
      mnemonic={mnemonic}
    />
  );
}
