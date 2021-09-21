import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';

export default ({ generate }) => {
  return (
    <Container>
      <Description>
        Your key identifies your account on Layer 2 and is saved locally on your browser.
      </Description>
      <Button onClick={generate}>Generate key</Button>
      <Note>
        Signing is free and will not send a transaction. You can recover your key at any time with your wallet.
      </Note>
    </Container>
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
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.primary};
  line-height: 20px;
  text-align: center;
`;

const Note = styled(Description)`
  color: ${({ theme }) => theme.text.color.secondary};
`;
