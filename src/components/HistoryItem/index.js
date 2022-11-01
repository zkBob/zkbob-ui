import React from 'react';
import styled from 'styled-components';

import Link from 'components/Link';
import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';
import { ZkAvatar } from 'components/ZkAccountIdentifier';

import { formatNumber, shortAddress } from 'utils';
import { tokenSymbol, tokenIcon } from 'utils/token';
import { useDateFromNow } from 'hooks';
import { HISTORY_ACTION_TYPES } from 'constants';

import depositIcon from 'assets/deposit.svg';
import withdrawIcon from 'assets/withdraw.svg';
import transferIcon from 'assets/transfer.svg';
import { ReactComponent as IncognitoAvatar } from 'assets/incognito-avatar.svg';

const { DEPOSIT, TRANSFER_IN, TRANSFER_OUT, WITHDRAWAL, TRANSFER_SELF } = HISTORY_ACTION_TYPES;

const actions = {
  [DEPOSIT]: {
    name: 'Deposit',
    icon: depositIcon,
    sign: '+',
  },
  [TRANSFER_IN]: {
    name: 'Transfer',
    icon: transferIcon,
    sign: '+',
  },
  [TRANSFER_OUT]: {
    name: 'Transfer',
    icon: transferIcon,
    sign: '-',
  },
  [WITHDRAWAL]: {
    name: 'Withdrawal',
    icon: withdrawIcon,
    sign: '-',
  },
  [TRANSFER_SELF]: {
    name: 'Transfer',
    icon: transferIcon,
    sign: '',
  }
};

const AddressLink = ({ action }) => {
  const address = action.type === DEPOSIT ? action.from : action.to;
  return (
    <Link size={16} href={process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', address)}>
      {shortAddress(address, 22)}
    </Link>
  );
};

export default ({ item, zkAccountId }) => {
  const date = useDateFromNow(item.timestamp);
  return (
    <Container>
      <Tooltip content={actions[item.type].name} delay={0.3}>
        <ActionLabel>
          <img src={actions[item.type].icon} alt="" />
        </ActionLabel>
      </Tooltip>
      <Column>
        <RowSpaceBetween>
          <Row>
            <TokenIcon src={tokenIcon()} />
            <Text>
              {actions[item.type].sign}{' '}
              <Tooltip content={formatNumber(item.amount, 18)} placement="top">
                <span>{formatNumber(item.amount)}</span>
              </Tooltip>
              {' '}{tokenSymbol()}
            </Text>
          </Row>
          <Row>
            <Date>{date}</Date>
            {item.pending && <SpinnerSmall size={22} />}
          </Row>
        </RowSpaceBetween>
        <RowSpaceBetween>
          <Row>
            <Text style={{ margin: '0 10px 0 2px' }}>
              {item.type === DEPOSIT ? 'From' : 'To'}
            </Text>
            {[DEPOSIT, WITHDRAWAL].includes(item.type) ? (
              <AddressLink action={item} />
            ) : (
              <Tooltip
                content={item.to}
                delay={0.3}
                placement="bottom"
                width={300}
                style={{
                  wordBreak: 'break-all',
                  textAlign: 'center',
                }}
              >
                <ZkAddress>
                  {item.type === TRANSFER_OUT ? (
                    <IncognitoAvatar />
                  ) : (
                    <ZkAvatar seed={zkAccountId} size={16} />
                  )}
                  <Text style={{ marginLeft: 5 }}>
                    {shortAddress(item.to, 22)}
                  </Text>
                </ZkAddress>
              </Tooltip>
            )}
          </Row>
          {item.txHash ? (
            <Link size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', item.txHash)}>
              View tx
            </Link>
          ) : (
            <span></span>
          )}
        </RowSpaceBetween>
      </Column>
    </Container>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const RowSpaceBetween = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Container = styled(Row)`
  align-items: flex-start;
  border-radius: 12px;
`;

const ActionLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.input.border.color.default};
  border-radius: 12px;
  width: 34px;
  height: 34px;
  box-sizing: border-box;
  cursor: pointer;
  margin-right: 10px;
  background-color: ${props => props.theme.color.white};
`;

const TokenIcon = styled.img`
  margin-right: 8px;
  width: 24px;
  height: 24px;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const Date = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  opacity: 60%;
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

const ZkAddress = styled(Row)`
  cursor: pointer;
`;
