import React from 'react';
import styled from 'styled-components';

import AccountSetUpButton from 'containers/AccountSetUpButton';

import Card from 'components/Card';

export default () => {
  return (
    <Card>
      <Container>
        <Title>
          Welcome to Private zkBob Transfers!
        </Title>
        <Description>
          Create a zkAccount to deposit into a private pool, transfer, or withdraw in private mode.
        </Description>
        <AccountSetUpButton />
      </Container>
    </Card>
  );
};

const Title = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  text-align: center;
`;

const Description = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
  text-align: center;
  margin: 16px 0 24px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px 20px;
`;
