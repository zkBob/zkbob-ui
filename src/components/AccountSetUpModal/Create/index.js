import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import CopyTextButton from 'components/CopyTextButton';
import SeedPhrase from 'components/SeedPhrase';

export default ({ mnemonic, next }) => {
  return (
    <Container>
      <Description>
        Write down or copy these words in the right order and save them somewhere safe
      </Description>
      <Warning>
        Never share your recovery phrase with anyone,<br/> store it securely!
      </Warning>
      <SeedPhrase value={mnemonic} />
      <CopyTextButton text={mnemonic} style={{ alignSelf: 'center' }}>
        Copy seed phrase
      </CopyTextButton>
      <Button onClick={next}>Continue</Button>
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
