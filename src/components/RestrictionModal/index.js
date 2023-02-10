import React from 'react';
import styled from 'styled-components';

import Link from 'components/Link';

import image from 'assets/bob-earth.png';

export default () => (
  <Container>
    <img width={250} src={image} alt="" />
    <Title>
      zkBob is not supported in this country or region
    </Title>
    <Description>
      zkBob is not supported in United Arab Emirates.{' '}
      You will be able to use the application from supported country or region.
      <Link
        href="https://docs.zkbob.com/zkbob-overview/compliance-and-security#geo-restrictions"
        style={{ marginLeft: 5 }}
      >Learn more</Link>
    </Description>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.card.background};
  box-shadow: 0px 8px 50px rgba(255, 214, 110, 0.2);
  border-radius: 24px;
  padding: 30px 20px;
  margin-top: 60px;
  width: 480px;
  max-width: 100%;
  box-sizing: border-box;
  & > * {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Title = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.text.color.primary};
  text-align: center;
`;

const Description = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 22px;
  text-align: center;
`;
