import React, { useCallback, useState, useContext} from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import { ModalContext, ZkAccountContext } from 'contexts';

export default () => {
  const { isChangePasswordModalOpen, closeChangePasswordModal } = useContext(ModalContext);
  const { changePassword, verifyPassword } = useContext(ZkAccountContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [lengthError, setLengthError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [wrongPasswordError, setWrongPasswordError] = useState(false);

  const handleOldPasswordChange = useCallback(e => {
    setWrongPasswordError(false);
    setOldPassword(e.target.value);
  }, []);

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

  const confirm = useCallback(async () => {
    const wrongPasswordError = !verifyPassword(oldPassword);
    const lengthError = !newPassword || newPassword.length < 6;
    const matchError = newPassword !== newPasswordConfirmation;
    setWrongPasswordError(wrongPasswordError);
    setLengthError(lengthError);
    setMatchError(matchError);
    if (!lengthError && !matchError && !wrongPasswordError) {
      changePassword(oldPassword, newPassword);
      closeChangePasswordModal();
    }
  }, [
    oldPassword, newPassword, newPasswordConfirmation,
    changePassword, verifyPassword, closeChangePasswordModal,
  ]);

  const handleKeyPress = useCallback(event => {
    if(event.key === 'Enter'){
      confirm();
    }
  }, [confirm]);

  return (
    <Modal
      isOpen={isChangePasswordModalOpen}
      onClose={closeChangePasswordModal}
      title="Change password"
    >
      <Container onKeyPress={handleKeyPress}>
        <Input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          error={wrongPasswordError}
        />
        <Input
          type="password"
          placeholder="New password 6+ characters"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={lengthError || matchError}
        />
        <Input
          type="password"
          placeholder="Verify new password"
          value={newPasswordConfirmation}
          onChange={handleNewPasswordConfirmationChange}
          error={lengthError || matchError}
        />
        <RulesContainer>
          <Rule $error={wrongPasswordError}>Enter the correct old password</Rule>
          <Rule $error={lengthError}>Please enter 6 or more characters</Rule>
          <Rule $error={matchError}>New password should match</Rule>
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
