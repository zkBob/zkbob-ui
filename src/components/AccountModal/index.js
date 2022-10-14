import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Link from 'components/Link';
import PrivateAddress from 'components/PrivateAddress';
import Tooltip from 'components/Tooltip';
import { ZkAvatar, ZkName } from 'components/ZkAccountIdentifier';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

import { shortAddress, formatNumber } from 'utils';
import { tokenSymbol, tokenIcon } from 'utils/token';

export default ({
  isOpen, onClose, account = '', zkAccount, zkAccountId,
  changeAccount, changeZkAccount, connector, logout,
  balance, poolBalance, privateAddress, generatePrivateAddress,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  const change = useCallback(cb => {
    onClose();
    cb();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account"
    >
      <AccountContainer>
        {account ? (
          <>
            <RowSpaceBetween>
              <AccountTitle>Wallet</AccountTitle>
              <TokenContainer>
                <TokenIcon src={tokenIcon()} />
                <Tooltip content={formatNumber(balance, 18)} placement="top">
                  <span>{formatNumber(balance)}</span>
                </Tooltip>
                <span style={{ marginLeft: 5 }}>{tokenSymbol()}</span>
              </TokenContainer>
            </RowSpaceBetween>
            <CopyToClipboard text={account} onCopy={onCopy}>
              <AddressContainer>
                {connector?.icon && <Icon src={connector.icon} />}
                <Address>{shortAddress(account, 22)}</Address>
                <Tooltip content="Copied" placement="right" visible={isCopied}>
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </Tooltip>
              </AddressContainer>
            </CopyToClipboard>
            <RowSpaceBetween>
              <Link href={process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', account)}>
                View in Explorer
              </Link>
              <Button type="link" onClick={() => change(changeAccount)}>
                Switch
              </Button>
            </RowSpaceBetween>
          </>
        ) : (
          <RowSpaceBetween>
            <AccountTitle>Wallet</AccountTitle>
            <Button $small onClick={() => change(changeAccount)}>Connect</Button>
          </RowSpaceBetween>
        )}
      </AccountContainer>
      <AccountContainer>
        {zkAccount ? (
          <>
            <RowSpaceBetween>
              <AccountTitle>zkAccount</AccountTitle>
              <TokenContainer>
                <TokenIcon src={tokenIcon(true)} />
                <Tooltip content={formatNumber(poolBalance, 18)} placement="top">
                  <span>{formatNumber(poolBalance)}</span>
                </Tooltip>
                <span style={{ marginLeft: 5 }}>{tokenSymbol(true)}</span>
              </TokenContainer>
            </RowSpaceBetween>
            <RowSpaceBetween>
              <Row>
                <ZkAvatar seed={zkAccountId} size={20} />
                <Address><ZkName seed={zkAccountId} /></Address>
              </Row>
            </RowSpaceBetween>
            {privateAddress ? (
              <PrivateAddress>{privateAddress}</PrivateAddress>
            ) : (
              <Button onClick={generatePrivateAddress}>Generate receiving address</Button>
            )}
            <PrivateAddressDescription>
              Use this address to receive tokens to your zkBob account.{' '}
              You create a new address each time you connect.{' '}
              Receive tokens to this address or a previously generated address.
            </PrivateAddressDescription>
            <RowSpaceBetween>
              <div></div>
              <Row>
                <Button type="link" onClick={() => change(changeZkAccount)} style={{ marginRight: 20 }}>
                  Switch
                </Button>
                <Button type="link" onClick={logout}>
                  Log out
                </Button>
              </Row>
            </RowSpaceBetween>
          </>
        ) : (
          <RowSpaceBetween>
            <AccountTitle>zkAccount</AccountTitle>
            <Button $small onClick={() => change(changeZkAccount)}>Create</Button>
          </RowSpaceBetween>
        )}
      </AccountContainer>
    </Modal>
  );
};

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const RowSpaceBetween = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const AccountTitle = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
`;

const Address = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.default};
  margin: 0 8px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const PrivateAddressDescription = styled.span`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin: 10px 0 20px;
  line-height: 22px;
`;

const CopyIcon = styled(CopyIconDefault)``;

const AddressContainer = styled(Row)`
  cursor: pointer;
  margin-bottom: 20px;
  align-self: flex-start;
  flex-wrap: wrap;
  &:hover ${CopyIcon} {
    path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
