import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import shuffle from 'lodash.shuffle';

import Button from 'components/Button';

export default ({ mnemonic, confirmMnemonic }) => {
  const [shuffled] = useState(
    shuffle(mnemonic.split(' ').map((word, index) => ({ word, index })))
  );
  const [repeated, setRepeated] = useState([]);
  const [match, setMatch] = useState(false);

  const addWord = useCallback(wordObj => {
    const newRepeated = [...repeated];
    newRepeated.push(wordObj);
    setRepeated(newRepeated);
  }, [repeated]);

  const removeWord = useCallback(wordObj => {
    const index = repeated.map(({ index }) => index).indexOf(wordObj.index);
    const newRepeated = [...repeated];
    newRepeated.splice(index, 1);
    setRepeated(newRepeated);
  }, [repeated]);

  useEffect(() => {
    const match = mnemonic === repeated.map(({ word }) => word).join(' ');
    setMatch(match);
  }, [mnemonic, repeated]);

  return (
    <Container>
      <Description>
        Please input your secret phrase to verify it.<br/> Click on a word to remove it
      </Description>
      <MnemonicInput>
        {repeated.map(wordObj =>
          <Word
            key={wordObj.index}
            clickable
            onClick={() => removeWord(wordObj)}
          >
            {wordObj.word}
          </Word>
        )}
      </MnemonicInput>
      <Words>
        {shuffled.map(wordObj => {
          const disabled = repeated.map(({ index }) => index).includes(wordObj.index);
          return (
            <Word
              key={`shuffled-${wordObj.index}`}
              disabled={disabled}
              onClick={disabled ? null : () => addWord(wordObj)}
            >
              {wordObj.word}
            </Word>
          );
        })}
      </Words>
      <Button
        disabled={!match}
        onClick={confirmMnemonic}
        data-ga-id="signup-secret-phrase-confirm"
      >Verify</Button>
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
  border: 1px solid ${props => props.theme.mnemonic.border[props.disabled ? 'active' : 'default']};
  background: ${props => props.theme.mnemonic.background[props.disabled ? 'active' : 'default']};
  border-radius: 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
  margin-right: 8px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  font-size: 16px;
  color: ${props => props.theme.mnemonic.text.color[props.disabled ? 'active' : 'default']};
`;

const MnemonicInput = styled(Words)`
  min-height: 161px;
  background: ${({ theme }) => theme.input.background.primary};
  border: 1px solid ${({ theme }) => theme.input.border.color.default};
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
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
