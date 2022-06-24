import React, { useContext } from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import HistoryItem from 'components/HistoryItem';

import { ZkAccountContext } from 'contexts';

const note = 'Do not refresh the page for at least 30 seconds! Transaction status will update automatically.';

export default () => {
  const { pendingAction } = useContext(ZkAccountContext);
  return (
    <Card note={note}>
      <Title>Please wait for your transaction to finalize</Title>
      <Description>You can deposit, transfer or withdraw funds once the<br /> transaction is complete.</Description>
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
