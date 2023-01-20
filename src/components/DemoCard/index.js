import React from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import Link from 'components/Link';

export default () => {
  return (
    <Card>
      <Container>
        <Title>Demo version</Title>
        <Description>
          <Text>
            This zkBob version is designed for private,{' '}
            small-value transfers only (not for deposits/withdrawals).
          </Text>
        </Description>
        <Description>
          <Text>For a full-featured version,</Text>
          <Link href="/" internal size={16}>create a free zkBob account here.</Link>
        </Description>
      </Container>
    </Card>
  );
};

const Title = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  text-align: center;
  margin-bottom: 16px;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px 20px;
  @media only screen and (max-width: 500px) {
    padding: 0 6px 12px;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
`;
