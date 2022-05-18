import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Card from 'components/Card';
import Link from 'components/Link';
import Spinner from 'components/Spinner';
import Pagination from 'components/Pagination';
import Tooltip from 'components/Tooltip';

import AccountSetUpButton from 'containers/AccountSetUpButton';

import { ZkAccountContext } from 'contexts';

import { formatNumber } from 'utils';

import depositIcon from 'assets/deposit.svg';
import withdrawIcon from 'assets/withdraw.svg';
import transferIcon from 'assets/transfer.svg';
import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

const actions = {
  1: {
    name: 'Deposit',
    icon: depositIcon,
    sign: '+',
  },
  2: {
    name: 'Transfer',
    icon: transferIcon,
    sign: '+',
  },
  3: {
    name: 'Transfer',
    icon: transferIcon,
    sign: '-',
  },
  4: {
    name: 'Withdrawal',
    icon: withdrawIcon,
    sign: '-',
  },
  5: {
    name: 'Transfer',
    icon: transferIcon,
    sign: '',
  }
};

const ONE_DAY = 86400000;

function getDateFormat(timestamp) {
  const time = moment(timestamp * 1000);
  if (moment().diff(time) > ONE_DAY) {
    return time.format('MMM D, YYYY');
  } else {
    return time.fromNow();
  }
}

export default () => {
  const { history, zkAccount, isLoadingZkAccount, isLoadingHistory } = useContext(ZkAccountContext);

  const pageSize = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = isLoadingZkAccount || isLoadingHistory;
  const isHistoryEmpty = !(history?.length > 0);
  const title = 'History';

  return (
    <Card title={(!isLoading && !isHistoryEmpty) ? title : null}>
      {(isLoading || isHistoryEmpty || !zkAccount) && (
        <Title>{title}</Title>
      )}
      {isLoading && (
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
            <Row key={index}>
              <Tooltip content={actions[item.type].name} delay={0.3}>
                <ActionLabel>
                  <img src={actions[item.type].icon} />
                </ActionLabel>
              </Tooltip>
              <AmountContainer>
                <TokenIcon src={item.type === 1 ? daiIcon : zpDaiIcon} />
                <Amount>
                  {actions[item.type].sign}{' '}
                  <Tooltip content={item.amount} placement="top">
                    <span>{formatNumber(item.amount)}</span>
                  </Tooltip>
                  {' '}{item.type === 1 ? 'DAI' : 'shDAI'}
                </Amount>
              </AmountContainer>
              <Link size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', item.txHash)}>
                {item.txHash.substring(0, 6)}...
              </Link>
              <Date>
                {getDateFormat(item.timestamp)}
              </Date>
            </Row>
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

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-right: 14px;
  &:hover {
    background: rgba(27, 77, 235, 0.05);
    border-radius: 12px;
  }
`;

const ActionLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.input.border.color.default};
  border-radius: 12px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 20px;
  background-color: ${props => props.theme.color.white};
`;

const TokenIcon = styled.img`
  margin-right: 8px;
  width: 24px;
  height: 24px;
`;

const Amount = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const Date = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  opacity: 60%;
  width: 115px;
  margin-left: 10px;
  text-align: end;
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

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
