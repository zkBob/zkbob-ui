import React from 'react';
import styled from 'styled-components';

import WalletConnectors from 'components/WalletConnectors';

export default ({ next, isCreation }) => {
  return (
    <Container>
      <Description>
        {isCreation
          ? 'Choose the wallet that will be associated with your zkAccount'
          : 'Select the wallet you used to create your zkAccount'
        }
      </Description>
      <WalletConnectors
        callback={next}
        gaIdPrefix={(isCreation ? 'signup-' : 'login-')}
      />
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
  color: ${({ theme }) => theme.text.color.primary};
  line-height: 20px;
  text-align: center;
`;
