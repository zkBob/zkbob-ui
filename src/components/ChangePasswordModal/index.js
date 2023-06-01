import React, { useCallback, useState, useContext} from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import { ModalContext, ZkAccountContext } from 'contexts';

export default () => {
  const { isChangePasswordModalOpen, closeChangePasswordModal } = useContext(ModalContext);
  const { setPassword } = useContext(ZkAccountContext);
  const history = useHistory();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [lengthError, setLengthError] = useState(false);
  const [matchError, setMatchError] = useState(false);

  const handleNewPasswordChange = useCallback(e => {
    setLengthError(false);
    setMatchError(false);
    setNewPassword(e.target.value);
  }, []);

  const handleNewPasswordConfirmationChange = useCallback(e => {
    setLengthError(false);
    setMatchError(false);
    setNewPasswordConfirmation(e.target.value);
  }, []);

  const closeModal = useCallback(() => {
    setLengthError(false);
    setMatchError(false);
    setNewPassword('');
    setNewPasswordConfirmation('');
    closeChangePasswordModal();
  }, [closeChangePasswordModal]);

  const confirm = useCallback(async () => {
    const lengthError = !newPassword || newPassword.length < 6;
    const matchError = newPassword !== newPasswordConfirmation;
    setLengthError(lengthError);
    setMatchError(matchError);
    if (!lengthError && !matchError) {
      setPassword(newPassword);
      closeModal();
    }
    history.replace(history.location.pathname);
  }, [
    newPassword, newPasswordConfirmation,
    setPassword, closeModal, history,
  ]);

  const handleKeyPress = useCallback(event => {
    if(event.key === 'Enter'){
      confirm();
    }
  }, [confirm]);

  return (
    <Modal
      isOpen={isChangePasswordModalOpen}
      onClose={closeModal}
      title="Set password"
    >
      <Container onKeyPress={handleKeyPress}>
        <Input
          type="password"
          placeholder="Password 6+ characters"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={lengthError || matchError}
        />
        <Input
          type="password"
          placeholder="Verify password"
          value={newPasswordConfirmation}
          onChange={handleNewPasswordConfirmationChange}
          error={lengthError || matchError}
        />
        <RulesContainer>
          <Rule $error={lengthError}>Please enter 6 or more characters</Rule>
          <Rule $error={matchError}>Password should match</Rule>
        </RulesContainer>
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

const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 25px;
`;

const Rule = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color[props.$error ? 'error' : 'secondary']};
  position: relative;
  margin-bottom: 8px;
  &::before {
    content: ".";
    position: absolute;
    left: -12px;
    top: -10px;
    font-size: 20px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;
