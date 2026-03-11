import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Card from 'components/Card';
import Spinner from 'components/Spinner';
import Pagination from 'components/Pagination';
import HistoryItem from 'components/HistoryItem';
import { actions, getSign } from 'components/HistoryItem';
import Button from 'components/Button';
import AccountSetUpButton from 'containers/AccountSetUpButton';
import { ReactComponent as CsvFileIcon} from 'assets/csv-file.svg';

import { PoolContext, ZkAccountContext } from 'contexts';
import { useWindowDimensions } from 'hooks';

export default () => {
  const { t } = useTranslation();
  const {
    history, zkAccount, pendingDirectDeposits,
    isLoadingZkAccount, isLoadingHistory,
  } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const { width } = useWindowDimensions();
  const isMobile = width <= 500;

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = isLoadingZkAccount || isLoadingHistory;
  const title = t('history.title');

  const items = pendingDirectDeposits.concat(history);
  const isHistoryEmpty = items.length === 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [zkAccount, currentPool]);


  const exportData = () => {
    const headers = ['amount', 'from', 'to', 'toYourself', 'commitment', 'extraInfo', 'failed', 'fee', 'from', 'txHash', 'type', 'state', 'failureReason', 'timestamp'];
    let csvContent = items.map(item => {
      let result = item.actions.map(action => {
        console.log("action", action);
        return [
          getSign(item) + action.amount.toString(),
          action.from,
          action.to,
          action.isLoopback.toString(),
          item.commitment,
          item.extraInfo,
          item.failed.toString(),
          item.fee,
          item.from,
          item.txHash,
          actions[item.type].name,
          item.state == 2 ? "finalized" : "pending",
          item.failureReason,
          item.timestamp
        ].join(',')
      }).join('\n');
      return result;
    }).join('\n');

    const blob = new Blob([headers.join(',') + '\n' + csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div>
      <Card titleStyle={{ marginBottom: 22 }}>
        {((isLoading && isHistoryEmpty) || isHistoryEmpty || !zkAccount) && (
          <CustomTitle>{title}</CustomTitle>
        )}
        {!isHistoryEmpty && (
          <TitleRow>
            <Title>{title}</Title>
            <ExportButton type="link" onClick={exportData}>
              <CsvFileIcon />
              Download history
            </ExportButton>
          </TitleRow>
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
              <HistoryItem key={index} item={item} zkAccount={zkAccount} currentPool={currentPool} isMobile={isMobile} />
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
    </div>
  );
};

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 22px;
`;

const CustomTitle = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  text-align: center;
`;

const Title = styled.span`
  color: ${props => props.theme.card.title.color};
  font-size: 16px;
  font-weight: ${props => props.theme.text.weight.normal};
  flex: 1;
`;

const Description = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.text.color.secondary};
  text-align: center;
`;

const ExportButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
