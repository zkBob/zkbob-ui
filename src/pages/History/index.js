import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import Spinner from 'components/Spinner';
import Pagination from 'components/Pagination';
import HistoryItem from 'components/HistoryItem';

import AccountSetUpButton from 'containers/AccountSetUpButton';

import { PoolContext, ZkAccountContext } from 'contexts';

export default () => {
  const {
    history, zkAccount, zkAccountId,
    isLoadingZkAccount, isLoadingHistory,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = isLoadingZkAccount || isLoadingHistory;
  const isHistoryEmpty = !(history?.length > 0);
  const title = 'History';

  return (
    <Card title={!isHistoryEmpty ? title : null} titleStyle={{ marginBottom: 22 }}>
      {((isLoading && isHistoryEmpty) || isHistoryEmpty || !zkAccount) && (
        <Title>{title}</Title>
      )}
      {(isLoading && isHistoryEmpty) && (
        <Spinner size={60} />
      )}
      {(!isLoading && isHistoryEmpty) && (
        <Description>
          Make your first Deposit, Transfer or Withdrawal<br/>
          to create your History.
        </Description>
      )}
      {(!isLoading && !zkAccount) && (
        <AccountSetUpButton />
      )}
      {!isHistoryEmpty && (
        <>
          {history.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) =>
            <HistoryItem key={index} item={item} zkAccountId={zkAccountId} currentPool={currentPool} />
          )}
          {history.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              numberOfPages={Math.ceil(history.length / pageSize)}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </Card>
  );
};

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
