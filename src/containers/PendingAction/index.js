import React, { useContext } from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import HistoryItem from 'components/HistoryItem';

import { ZkAccountContext } from 'contexts';

export default () => {
  const { pendingActions } = useContext(ZkAccountContext);
  const multi = pendingActions.length > 1;
  return (
    <Card
      note={
      `Do not refresh the page for at least 30 seconds! Transaction status${multi ? 'es' : ''} will update automatically.`
      }
    >
      <Title>
        Please wait for your transaction{multi ? 's' : ''} to finalize
      </Title>
      <Description>
        You can deposit, transfer or withdraw funds once the<br /> transaction{multi ? 's are' : ' is'} completed.
      </Description>
      <ListContainer>
        {pendingActions.map((action, index) =>
          <HistoryItemContainer key={index}>
            <HistoryItem item={action} />
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
