import React, { useContext } from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import HistoryItem from 'components/HistoryItem';

import { ZkAccountContext } from 'contexts';

const note = 'Please do not refresh the page. The status of the transaction will be updated automatically.';

export default () => {
  const { pendingAction } = useContext(ZkAccountContext);
  return (
    <Card note={note}>
      <Title>Please wait for the transaction to be completed.</Title>
      <Description>You can make Deposit, Transfer or Withdrawal after<br /> the transaction is completed.</Description>
      <HistoryItemContainer>
        {pendingAction && <HistoryItem item={pendingAction} />}
      </HistoryItemContainer>
    </Card>
  );
}

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
  padding: 0 16px;
  margin: 18px 0 30px;
`;
