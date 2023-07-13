import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { HistoryTransactionType } from 'zkbob-client-js';

import Link from 'components/Link';
import Spinner from 'components/Spinner';
import Tooltip from 'components/Tooltip';
import Button from 'components/Button';
import MultitransferDetailsModal from 'components/MultitransferDetailsModal';
import { ZkAvatar } from 'components/ZkAccountIdentifier';

import { formatNumber, shortAddress } from 'utils';
import { useDateFromNow, useWindowDimensions } from 'hooks';
import { NETWORKS, TOKENS_ICONS } from 'constants';

import { ReactComponent as DepositIcon } from 'assets/deposit.svg';
import { ReactComponent as WithdrawIcon } from 'assets/withdraw.svg';
import { ReactComponent as TransferIcon } from 'assets/transfer.svg';
import { ReactComponent as IncognitoAvatar } from 'assets/incognito-avatar.svg';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

const {
  Deposit,
  TransferIn,
  TransferOut,
  Withdrawal,
  DirectDeposit,
} = HistoryTransactionType;

const actions = {
  [Deposit]: {
    name: 'Deposit',
    icon: DepositIcon,
    sign: '+',
  },
  [TransferIn]: {
    name: 'Transfer',
    icon: TransferIcon,
    sign: '+',
  },
  [TransferOut]: {
    name: 'Transfer',
    icon: TransferIcon,
    sign: '-',
  },
  [Withdrawal]: {
    name: 'Withdrawal',
    icon: WithdrawIcon,
    sign: '-',
  },
  [DirectDeposit]: {
    name: 'Deposit',
    icon: DepositIcon,
    sign: '+',
  },
  5: { // old transfer self
    name: 'Transfer',
    icon: TransferIcon,
    sign: '',
  },
};

function getSign(item) {
  if (item.actions.length === 1 && item.actions[0].isLoopback) {
    return '';
  }
  return actions[item.type].sign;
}

const AddressLink = ({ action, isMobile, currentChainId }) => {
  const address = action.type === Deposit ? action.actions[0].from : action.actions[0].to;
  return (
    <Link
      size={16}
      href={NETWORKS[currentChainId].blockExplorerUrls.address.replace('%s', address)}
    >
      {shortAddress(address, isMobile ? 10 : 22)}
    </Link>
  );
};

const Fee = ({ fee, highFee, isMobile, tokenSymbol }) => (
  <>
    {!fee.isZero() && (
      <FeeText>(fee {formatNumber(fee)} {tokenSymbol})</FeeText>
    )}
    {highFee && (
      <Tooltip
        content={
          <span>
            This transaction required additional operations, resulting in higher fees.{' '}
            <Link href="https://docs.zkbob.com/zkbob-overview/fees/unspent-note-handling">
              Learn more
            </Link>
          </span>
        }
        placement={isMobile ? 'bottom' : 'right'}
        delay={0}
        width={200}
      >
        <InfoIcon />
      </Tooltip>
    )}
  </>
);

export default ({ item, zkAccount, currentPool }) => {
  const date = useDateFromNow(item.timestamp);
  const { width } = useWindowDimensions();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isMobile = width <= 500;
  const currentChainId = currentPool.chainId;
  const tokenSymbol = useMemo(() => {
    const isWrapped = currentPool.isNative && item.type === HistoryTransactionType.Deposit;
    return (isWrapped ? 'W' : '') + currentPool.tokenSymbol;
  }, [currentPool, item.type]);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  const isPending = [0, 1].includes(item.state);
  const isDirectDepositLabelShown = item.type === DirectDeposit && !currentPool.isNative;

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
            <Row>
              <TokenIcon src={TOKENS_ICONS[tokenSymbol]} />
              <Text $error={item.failed}>
                {getSign(item)}{' '}
                {(() => {
                  const total = item.actions.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero);
                  return (
                    <Tooltip content={formatNumber(total, 18)} placement="top">
                      <span>{formatNumber(total, 4)}</span>
                    </Tooltip>
                  );
                })()}
                {' '}{tokenSymbol}
              </Text>
            </Row>
            {item.fee && (
              <FeeDesktop>
                <Fee fee={item.fee} highFee={item.highFee} tokenSymbol={tokenSymbol} />
              </FeeDesktop>
            )}
          </Row>
          <Row>
            <Date>{date}</Date>
            {isPending && <SpinnerSmall size={22} />}
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
        {item.fee && (
          <FeeMobile>
            <Fee fee={item.fee} highFee={item.highFee} tokenSymbol={tokenSymbol} isMobile />
          </FeeMobile>
        )}
        <RowSpaceBetween>
          <Row>
            <Text style={{ margin: '0 10px 0 2px' }}>
              {item.type === Deposit ? 'From' : 'To'}
            </Text>
            {[Deposit, Withdrawal].includes(item.type) ? (
              <AddressLink action={item} isMobile={isMobile} currentChainId={currentChainId} />
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
                  <Tooltip content="Copied" placement="right" visible={isCopied}>
                    <CopyToClipboard text={item.actions[0].to} onCopy={onCopy}>
                      <ZkAddress>
                        {(item.type === TransferOut && !item.actions[0].isLoopback) ? (
                          <IncognitoAvatar />
                        ) : (
                          <ZkAvatar seed={zkAccount} size={16} />
                        )}
                        <Text style={{ marginLeft: 5 }}>
                          {shortAddress(
                            item.actions[0].to,
                            isMobile ? 10 : (isDirectDepositLabelShown ? 16 : 22)
                          )}
                        </Text>
                      </ZkAddress>
                    </CopyToClipboard>
                  </Tooltip>
                </Tooltip>
              ) : (
                <ZkAddress>
                  {item.type === TransferOut ? (
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
                      <ZkAvatar seed={zkAccount} size={16} />
                      <Text style={{ marginLeft: 5 }}>
                        {shortAddress(
                          item.actions[0].to,
                          isMobile ? 10 : (isDirectDepositLabelShown ? 16 : 22)
                        )}
                      </Text>
                    </>
                  )}
                </ZkAddress>
              )
            )}
          </Row>
          <Row>
            {item.actions.length > 1 && item.type === TransferOut && (
              <MultitransferLabel>
                {isMobile ? 'Multi' : 'Multitransfer'}
              </MultitransferLabel>
            )}
            {isDirectDepositLabelShown && (
              <DirectDepositLabel>
                {isMobile ? 'Direct' : 'Direct deposit'}
                {isPending && (
                  <Tooltip
                    content={
                      <span>
                        Either a deposit sent via a 3rd party platform or a native token (ETH) deposit.{' '}
                        Direct deposits can take up to 10 minutes.{' '}
                        <Link href="https://docs.zkbob.com">
                          Learn more
                        </Link>
                      </span>
                    }
                    placement={isMobile ? 'bottom' : 'right'}
                    delay={0}
                    width={200}
                  >
                    <InfoIcon />
                  </Tooltip>
                )}
              </DirectDepositLabel>
            )}
            {(item.txHash && item.txHash !== '0') ? (
              <Link size={16} href={NETWORKS[currentChainId].blockExplorerUrls.tx.replace('%s', item.txHash)}>
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
          transfers={item.actions.map(action => ({ address: action.to, ...action }))}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          zkAccount={zkAccount}
          isSent={true}
          currentPool={currentPool}
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

const FeeText = styled(Date)``;

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

const MultitransferLabel = styled.div`
  background: #E6FFFA;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  color: #319795;
  padding: 0 8px;
  margin-right: 10px;
  font-weight: ${props => props.theme.text.weight.bold};
  display: flex;
  align-items: center;
`;

const DirectDepositLabel = styled(MultitransferLabel)`
  background: #FFFAF0;
  color: #DD6B20;
`;

const InfoIcon = styled(InfoIconDefault)`
  margin-left: 3px;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;

const FeeDesktop = styled(Row)`
  margin-left: 5px;
  @media only screen and (max-width: 500px) {
    display: none;
  }
`;

const FeeMobile = styled(Row)`
  display: none;
  @media only screen and (max-width: 500px) {
    display: flex;
  }
`;
