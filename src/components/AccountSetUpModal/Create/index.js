import React from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from 'components/Button';

export default ({ mnemonic, next }) => {
  return (
    <Container>
      <Description>
        Write down or copy these words in the right order and save them somewhere safe
      </Description>
      <Warning>
        Never share recovery phrase with anyone, store it securely!
      </Warning>
      <Mnemonic>
        {mnemonic.split(' ').map((word, index) =>
          <WordContainer key={index}>
            <Number>{index + 1} </Number>
            <Word>{word}</Word>
          </WordContainer>
        )}
      </Mnemonic>
      <CopyToClipboard text={mnemonic}>
        <LinkButton type="link">Copy seed phrase</LinkButton>
      </CopyToClipboard>
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

const Mnemonic = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-bottom: 0;
`;

const WordContainer = styled.div`
  padding: 8px 10px;
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
  margin-right: 8px;
`;

const Word = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const Number = styled(Word)`
  color: ${({ theme }) => theme.text.color.secondary};
`;

const Description = styled.span`
  font-size: 12px;
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
  font-size: 12px;
  line-height: 20px;
  margin-left: -7px;
  margin-right: -7px;
`;

const LinkButton = styled(Button)`
  font-size: 16px;
`;
