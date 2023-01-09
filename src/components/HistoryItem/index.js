import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import Link from 'components/Link';
import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';
import Button from 'components/Button';
import MultitransferDetailsModal from 'components/MultitransferDetailsModal';
import { ZkAvatar } from 'components/ZkAccountIdentifier';

import { formatNumber, shortAddress } from 'utils';
import { tokenSymbol, tokenIcon } from 'utils/token';
import { useDateFromNow, useWindowDimensions } from 'hooks';
import { HISTORY_ACTION_TYPES } from 'constants';

import { ReactComponent as DepositIcon } from 'assets/deposit.svg';
import { ReactComponent as WithdrawIcon } from 'assets/withdraw.svg';
import { ReactComponent as TransferIcon } from 'assets/transfer.svg';
import { ReactComponent as IncognitoAvatar } from 'assets/incognito-avatar.svg';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

const { DEPOSIT, TRANSFER_IN, TRANSFER_OUT, WITHDRAWAL, TRANSFER_SELF } = HISTORY_ACTION_TYPES;

const actions = {
  [DEPOSIT]: {
    name: 'Deposit',
    icon: DepositIcon,
    sign: '+',
  },
  [TRANSFER_IN]: {
    name: 'Transfer',
    icon: TransferIcon,
    sign: '+',
  },
  [TRANSFER_OUT]: {
    name: 'Transfer',
    icon: TransferIcon,
    sign: '-',
  },
  [WITHDRAWAL]: {
    name: 'Withdrawal',
    icon: WithdrawIcon,
    sign: '-',
  },
  [TRANSFER_SELF]: {
    name: 'Transfer',
    icon: TransferIcon,
    sign: '',
  }
};

const AddressLink = ({ action, isMobile }) => {
  const address = action.type === DEPOSIT ? action.actions[0].from : action.actions[0].to;
  return (
    <Link size={16} href={process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', address)}>
      {shortAddress(address, isMobile ? 10 : 22)}
    </Link>
  );
};

export default ({ item, zkAccountId }) => {
  const date = useDateFromNow(item.timestamp);
  const { width } = useWindowDimensions();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const isMobile = width <= 500;
  return (
    <Container>
      <Tooltip content={actions[item.type].name} delay={0.3}>
        <ActionLabel $error={item.failed}>
          {React.createElement(actions[item.type].icon, {})}
        </ActionLabel>
      </Tooltip>
      <Column>
        <RowSpaceBetween>
          <Row>
            <TokenIcon src={tokenIcon()} />
            <Text $error={item.failed}>
              {actions[item.type].sign}{' '}
              {(() => {
                const total = item.actions.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero);
                return (
                  <Tooltip content={formatNumber(total, 18)} placement="top">
                    <span>{formatNumber(total, isMobile ? 4 : 18)}</span>
                  </Tooltip>
                );
              })()}
              {' '}{tokenSymbol()}
            </Text>
          </Row>
          <Row>
            <Date>{date}</Date>
            {item.state === 1 && <SpinnerSmall size={22} />}
            {item.failed && (
              <>
                <Text $error style={{ marginLeft: 10 }}>failed</Text>
                <Tooltip content={item.failureReason || 'No description'} placement="right" delay={0} width={180}>
                  <InfoIcon />
                </Tooltip>
              </>
            )}
          </Row>
        </RowSpaceBetween>
        <RowSpaceBetween>
          <Row>
            <Text style={{ margin: '0 10px 0 2px' }}>
              {item.type === DEPOSIT ? 'From' : 'To'}
            </Text>
            {[DEPOSIT, WITHDRAWAL].includes(item.type) ? (
              <AddressLink action={item} isMobile={isMobile} />
            ) : (
              item.actions.length === 1 ? (
                <Tooltip
                  content={item.actions[0].to}
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
                      {shortAddress(item.actions[0].to, isMobile ? 10 : 22)}
                    </Text>
                  </ZkAddress>
                </Tooltip>
              ) : (
                <ZkAddress>
                  {item.type === TRANSFER_OUT ? (
                    <>
                      <IncognitoAvatar />
                      <Button
                        type="link"
                        onClick={() => setIsDetailsModalOpen(true)}
                        style={{ marginLeft: 5, fontSize: 16 }}
                      >
                        {item.actions.length} addresses
                      </Button>
                    </>
                  ) : (
                    <>
                      <ZkAvatar seed={zkAccountId} size={16} />
                      <Text style={{ marginLeft: 5 }}>
                        {shortAddress(item.actions[0].to, isMobile ? 10 : 22)}
                      </Text>
                    </>
                  )}
                </ZkAddress>
              )
            )}
          </Row>
          <Row>
            {item.actions.length > 1 && item.type === TRANSFER_OUT && (
              <Label>{isMobile ? 'Multi' : 'Multitransfer'}</Label>
            )}
            {(item.txHash && item.txHash !== '0') ? (
              <Link size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', item.txHash)}>
                View tx
              </Link>
            ) : (
              <span></span>
            )}
          </Row>
        </RowSpaceBetween>
      </Column>
      {item.actions.length > 1 && (
        <MultitransferDetailsModal
          transfers={item.actions.map(action => ({ address: action.to, amount: action.amount }))}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          isSent={true}
        />
      )}
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
  border: 1px solid ${props => props.theme.input.border.color[props.$error ? 'error' : 'default']};
  border-radius: 12px;
  width: 34px;
  height: 34px;
  box-sizing: border-box;
  cursor: pointer;
  margin-right: 10px;
  background-color: ${props => props.theme.color.white};
  ${props => props.$error && `
    & path {
      fill: ${props.theme.input.border.color.error};
    };
  `}
`;

const TokenIcon = styled.img`
  margin-right: 8px;
  width: 24px;
  height: 24px;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color[props.$error ? 'error' : 'primary']};
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

const Label = styled.div`
  background: #E6FFFA;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  color: #319795;
  padding: 0 8px;
  margin-right: 10px;
`;

const InfoIcon = styled(InfoIconDefault)`
  margin-bottom: -2px;
  margin-left: 3px;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
