import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import Spinner from 'components/Spinner';
import Button from 'components/Button';

export default ({ isCreation, sign }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await sign();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [sign]);

  return (
    <Container>
      {isLoading && <Spinner />}
      <Note>
        {isCreation
          ? 'Your zkAccount is being created based on the connected wallet.'
          : 'Accessing your zkAccount with your connected wallet.'
        }
      </Note>
      {!isLoading && <Button onClick={onClick}>Sign the message</Button>}
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

const Note = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
