import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import Button from 'components/Button';
import TextAreaDefault from 'components/TextArea';

export default ({ restore }) => {
  const [mnemonic, setMnemonic] = useState();
  const [error, setError] = useState(false);

  const onRestore = useCallback(() => {
    const preparedMnemonic = mnemonic.replace(/\s+/g, ' ').trim();
    const isValid = ethers.utils.isValidMnemonic(preparedMnemonic);
    if (isValid) {
      restore(preparedMnemonic);
    } else {
      setError(true);
    }
  }, [mnemonic, restore]);

  const onChange = useCallback(e => {
    setMnemonic(e.target.value);
    setError(false);
  }, []);

  return (
    <Container>
      <Description>
        Input your saved seed phrase to restore an existing account
      </Description>
      <TextArea value={mnemonic} onChange={onChange} $error={error} />
      <Button onClick={onRestore}>Restore account</Button>
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

const TextArea = styled(TextAreaDefault)`
  word-spacing: 7px;
  line-height: 26px;
  border-color: ${props => props.theme.input.border.color[props.$error ? 'error' : 'default']};
`;
