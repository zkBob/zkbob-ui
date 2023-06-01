import React, { useContext, useCallback, useState } from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Input';

import { ModalContext, ZkAccountContext } from 'contexts';

export default () => {
  const { isDisablePasswordModalOpen, closeDisablePasswordModal } = useContext(ModalContext);
  const { removePassword } = useContext(ZkAccountContext);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handlePasswordChange = useCallback(e => {
    setError(null);
    setPassword(e.target.value);
  }, []);

  const closeModal = useCallback(() => {
    closeDisablePasswordModal();
    setPassword('');
    setError(null);
  }, [closeDisablePasswordModal]);

  const confirm = useCallback(() => {
    try {
      removePassword(password);
      closeModal();
    } catch (error) {
      setError(error);
    }
  }, [password, removePassword, closeModal]);

  const handleKeyPress = useCallback(event => {
    if(event.key === 'Enter'){
      confirm();
    }
  }, [confirm]);

  return (
    <Modal
      isOpen={isDisablePasswordModalOpen}
      onClose={closeModal}
      title="Disable password"
    >
      <Container onKeyPress={handleKeyPress}>
        <Description>
          Please enter the current password
        </Description>
        <Input
          autoFocus
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          error={!!error}
        />
        <Button onClick={confirm}>Confirm</Button>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Description = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
