import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Card from 'components/Card';
import Spinner from 'components/Spinner';
import Pagination from 'components/Pagination';
import HistoryItem from 'components/HistoryItem';

import AccountSetUpButton from 'containers/AccountSetUpButton';

import { PoolContext, ZkAccountContext } from 'contexts';

export default () => {
  const { t } = useTranslation();
  const {
    history, zkAccount, pendingDirectDeposits,
    isLoadingZkAccount, isLoadingHistory,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = isLoadingZkAccount || isLoadingHistory;
  const title = t('history.title');

  const items = pendingDirectDeposits.concat(history);
  const isHistoryEmpty = items.length === 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [zkAccount, currentPool]);

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
          <Trans i18nKey="history.empty" />
        </Description>
      )}
      {(!isLoading && !zkAccount) && (
        <AccountSetUpButton />
      )}
      {!isHistoryEmpty && (
        <>
          {items.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) =>
            <HistoryItem key={index} item={item} zkAccount={zkAccount} currentPool={currentPool} />
          )}
          {items.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              numberOfPages={Math.ceil(items.length / pageSize)}
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
