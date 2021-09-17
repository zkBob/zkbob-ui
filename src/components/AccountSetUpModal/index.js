import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Button from 'components/Button';

const options = [
  {
    title: 'I already have a seed phrase',
    description: 'Import your existing account using 12 word seed phrase',
    actionText: 'Restore account',
  },
  {
    title: 'Set up a new account',
    description: 'This will create a new account and seed phrase',
    actionText: 'Set up account',
  },
  {
    title: 'Create a new account',
    description: 'Create account using a wallet private key',
    actionText: 'Create account',
  },
];

export default ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set up account">
      {options.map(option =>
        <OptionContainer>
          <Title>{option.title}</Title>
          <Description>{option.description}</Description>
          <Button small>{option.actionText}</Button>
        </OptionContainer>
      )}
    </Modal>
  );
};

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 24px;
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Description = styled(Title)`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
`;
