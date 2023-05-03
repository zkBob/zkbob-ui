import React, { useCallback } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Modal from 'components/Modal';
import Input from 'components/Input';

export default ({
  isOpen, confirm, reset, password,
  onPasswordChange, error, isAccountSetUpModalOpen
}) => {
  const handleKeyPress = useCallback(event => {
    if(event.key === 'Enter'){
      confirm();
    }
  }, [confirm]);
  return (
    <Modal
      isOpen={isOpen}
      title="Enter password"
      containerStyle={{ visibility: isAccountSetUpModalOpen ? 'hidden' : 'visible' }}
    >
      <Container onKeyPress={handleKeyPress}>
        <Description>
          To enhance security, password entry is required each time a page reloads.
        </Description>
        <Input
          autoFocus
          type="password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          error={!!error}
        />
        <Button onClick={confirm}>Sign in</Button>
        <Button type="link" onClick={reset}>Lost password? Restore account with your secret phrase.</Button>
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
