import React from 'react';
import styled from 'styled-components';

import Link from 'components/Link';
import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';

import { formatNumber } from 'utils';
import { tokenSymbol, tokenIcon } from 'utils/token';
import { useDateFromNow } from 'hooks';

import depositIcon from 'assets/deposit.svg';
import withdrawIcon from 'assets/withdraw.svg';
import transferIcon from 'assets/transfer.svg';

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

export default ({ item }) => {
  const date = useDateFromNow(item.timestamp);
  return (
    <Row $pending={item.pending}>
      <Tooltip content={actions[item.type].name} delay={0.3}>
        <ActionLabel>
          <img src={actions[item.type].icon} alt="" />
        </ActionLabel>
      </Tooltip>
      <AmountContainer>
        <TokenIcon src={tokenIcon(item.type !== 1)} />
        <Amount>
          {actions[item.type].sign}{' '}
          <Tooltip content={formatNumber(item.amount, 18)} placement="top">
            <span>{formatNumber(item.amount)}</span>
          </Tooltip>
          {' '}{tokenSymbol(item.type !== 1)}
        </Amount>
      </AmountContainer>
      {item.txHash ? (
        <Link size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', item.txHash)}>
          {item.txHash.substring(0, 6)}...
        </Link>
      ) : (
        <span></span>
      )}
      <DateRow>
        <Date>{date}</Date>
        {item.pending && <SpinnerSmall size={22} />}
      </DateRow>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-right: 14px;
  border-radius: 12px;
  background: ${props => props.$pending ? 'rgba(27, 77, 235, 0.05)' : 'none'};
  &:hover {
    background: rgba(27, 77, 235, 0.05);
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

const DateRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 115px;
  margin-left: 10px;
`;

const Date = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  opacity: 60%;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const SpinnerSmall = styled(Spinner)`
  margin-left: 10px;
  path {
    stroke: ${props => props.theme.text.color.primary};
    stroke-width: 8;
  }
  circle {
    stroke: ${props => props.theme.color.blueExtraLight};
    stroke-width: 8;
  }
`;
