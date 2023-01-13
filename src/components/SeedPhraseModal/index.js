import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Button from 'components/Button';
import CopyTextButton from 'components/CopyTextButton';
import Input from 'components/Input';
import SeedPhrase from 'components/SeedPhrase';

export default ({
  isOpen, onClose, mnemonic,
  confirm, password, onPasswordChange,
  onKeyPress, error,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Show secret recovery phrase"
    >
      <Container onKeyPress={mnemonic ? null : onKeyPress}>
        <Warning>
          Never share your recovery phrase with anyone,<br/> store it securely!
        </Warning>
        <Description>
          If someone has your secret phrase they will have full control of your wallet.
        </Description>
        {mnemonic ? (
          <>
            <SeedPhrase value={mnemonic} />
            <CopyTextButton text={mnemonic} style={{ alignSelf: 'center' }}>
              Copy seed phrase
            </CopyTextButton>
            <Button onClick={onClose}>Done</Button>
          </>
        ) : (
          <>
            <Input
              autoFocus
              type="password"
              placeholder="Password"
              value={password}
              onChange={onPasswordChange}
              error={!!error}
            />
            <Button onClick={confirm}>Next</Button>
          </>
        )}
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

const Warning = styled.div`
  background: ${({ theme }) => theme.warning.background};
  border: 1px solid ${({ theme }) => theme.warning.border};
  color: ${({ theme }) => theme.warning.text.color};
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 14px;
  line-height: 20px;
  margin-left: -7px;
  margin-right: -7px;
  text-align: center;
`;
