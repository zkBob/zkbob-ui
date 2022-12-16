import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Modal from 'components/Modal';

export default ({ isOpen, close }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Suspicious wallet connected"
      width={480}
    >
      <Container>
        <Description>
          We found that your wallet was involved in suspicious activities.{' '}
          Because of this, you can't use this wallet at zkBob. Please, try another wallet.
        </Description>
        <Button onClick={close}>Okay</Button>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px 6px;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Description = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 22px;
  text-align: center;
  margin-bottom: 24px;
`;
