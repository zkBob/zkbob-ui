import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import shuffle from 'lodash.shuffle';

import Button from 'components/Button';

export default ({ mnemonic, confirmMnemonic }) => {
  const [shuffled] = useState(shuffle(mnemonic.split(' ')));
  const [repeated, setRepeated] = useState([]);
  const [match, setMatch] = useState(false);
  const addWord = useCallback(word => {
    const index = repeated.indexOf(word);
    const newRepeated = [...repeated];
    if (index > -1) {
      newRepeated.splice(index, 1);
    } else {
      newRepeated.push(word);
    }
    setRepeated(newRepeated);
  }, [repeated]);
  useEffect(() => {
    const match = mnemonic === repeated.join(' ');
    setMatch(match);
  }, [mnemonic, repeated]);
  return (
    <Container>
      <Description>
        Please input your seed phrase to verify it
      </Description>
      <MnemonicInput>
        {repeated.map(word => <Word>{word}</Word>)}
      </MnemonicInput>
      <Words>
        {shuffled.map(word =>
          <Word
            active={repeated.includes(word)}
            clickable
            onClick={() => addWord(word)}
          >
            {word}
          </Word>
        )}
      </Words>
      <Button disabled={!match} onClick={confirmMnemonic}>Verify</Button>
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

const Words = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-bottom: 0;
  box-sizing: border-box;
`;

const Word = styled.div`
  padding: 8px 10px;
  border: 1px solid ${props => props.theme.mnemonic.border[props.active ? 'active' : 'default']};
  background: ${props => props.theme.mnemonic.background[props.active ? 'active' : 'default']};
  border-radius: 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
  margin-right: 8px;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  font-size: 16px;
  color: ${props => props.theme.mnemonic.text.color.[props.active ? 'active' : 'default']};
`;

const MnemonicInput = styled(Words)`
  min-height: 161px;
  background: ${({ theme }) => theme.input.background.primary};
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 16px;
  padding: 12px 12px 0;
  margin-bottom: 16px;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  & > ${Word} {
    margin-bottom: 12px;
  }
`;

const Description = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
