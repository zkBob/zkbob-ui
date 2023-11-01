import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Link from 'components/Link';

import image from 'assets/bob-earth.png';

export default () => {
  const { t } = useTranslation();
  return (
    <Container>
      <img width={250} src={image} alt="" />
      <Title>
        {t('restrictionModal.title')}
      </Title>
      <Description>
        {t('restrictionModal.description')}
        <Link
          href="https://docs.zkbob.com/zkbob-overview/compliance-and-security#geo-restrictions"
          style={{ marginLeft: 5, whiteSpace: 'nowrap' }}
        >
          {t('common.learnMore')}
        </Link>
      </Description>
    </Container>
  );
};

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
