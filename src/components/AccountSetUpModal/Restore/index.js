import React, { useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import TextAreaDefault from 'components/TextArea';

export default ({ restore }) => {
  const [mnemonic, setMnemonic] = useState();
  return (
    <Container>
      <Description>
        Input your saved seed phrase to restore an existing account
      </Description>
      <TextArea value={mnemonic} onChange={e => setMnemonic(e.target.value)} />
      <Button onClick={() => restore(mnemonic)}>Restore account</Button>
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
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;

const TextArea = styled(TextAreaDefault)`
  word-spacing: 7px;
  line-height: 26px;
`;
