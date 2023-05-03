import React from 'react';
import styled from 'styled-components';

import Spinner from 'components/Spinner';

export default ({ isCreation }) => {
  return (
    <Container>
      <Spinner />
      <Note>
        {isCreation
          ? 'Your zkAccount is being created based on the connected wallet.'
          : 'Accessing your zkAccount with your connected wallet.'
        }
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

const Note = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
