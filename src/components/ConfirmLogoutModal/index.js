import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Modal from 'components/Modal';

export default ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log out and clear browsing data"
    >
      <Container>
        <Description>
          When you log out your zkAccount information is erased from
          the data cache and is no longer accessible with your password.
          Restore the account and balance using your seed phrase and a new password.
        </Description>
        <Button onClick={onConfirm}>Log out</Button>
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
  line-height: 22px;
  text-align: center;
`;
