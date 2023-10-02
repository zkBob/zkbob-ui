import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Card from 'components/Card';
import HistoryItem from 'components/HistoryItem';

import { PoolContext, ZkAccountContext } from 'contexts';
import { useWindowDimensions } from 'hooks';

export default () => {
  const { t } = useTranslation();
  const { pendingActions, zkAccount } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const { width } = useWindowDimensions();
  const isMobile = width <= 500;
  return (
    <Card
      note={t('pendingAction.note', { count: pendingActions.length })}
    >
      <Title>
      {t('pendingAction.title', { count: pendingActions.length })}
      </Title>
      <Description>
      {t('pendingAction.description', { count: pendingActions.length })}
      </Description>
      <ListContainer>
        {pendingActions.map((action, index) =>
          <HistoryItemContainer key={index}>
            <HistoryItem item={action} currentPool={currentPool} zkAccount={zkAccount} isMobile={isMobile} />
          </HistoryItemContainer>
        )}
      </ListContainer>
    </Card>
  );
}

const ListContainer = styled.div`
  padding: 0 16px;
  margin: 18px 0 30px;
`;

const Title = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  text-align: center;
`;

const Description = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.text.color.secondary};
  text-align: center;
`;

const HistoryItemContainer = styled.div`
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
`;
