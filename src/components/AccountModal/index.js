import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Link from 'components/Link';
import { ZkAvatar, ZkName } from 'components/ZkAccountIdentifier';

import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

import { shortAddress, formatNumber } from 'utils';

export default ({
  isOpen, onClose, account = '', zkAccount,
  changeAccount, changeZkAccount, connector,
  balance, poolBalance,
}) => {
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
              <AccountTitle>Connected with {connector?.name}</AccountTitle>
              <Button type="link" onClick={() => change(changeAccount)}>
                Change
              </Button>
            </RowSpaceBetween>
            <RowSpaceBetween>
              <Row>
                {connector?.icon && <Icon src={connector.icon} />}
                <Address>{shortAddress(account)}</Address>
              </Row>
              <TokenContainer>
                <TokenIcon src={daiIcon} />
                {formatNumber(balance)} DAI
              </TokenContainer>
            </RowSpaceBetween>
            <Row>
              <CopyToClipboard text={account} style={{ marginRight: 16 }}>
                <Button type="link">Copy address</Button>
              </CopyToClipboard>
              <Link href={process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', account)}>
                View in Explorer
              </Link>
            </Row>
          </>
        ) : (
          <RowSpaceBetween>
            <AccountTitle>Wallet</AccountTitle>
            <Button small onClick={() => change(changeAccount)}>Connect</Button>
          </RowSpaceBetween>
        )}
      </AccountContainer>
      <AccountContainer>
        {zkAccount ? (
          <>
            <RowSpaceBetween>
              <AccountTitle>Zero knowledge account</AccountTitle>
              <Button type="link" onClick={() => change(changeZkAccount)}>
                Change
              </Button>
            </RowSpaceBetween>
            <RowSpaceBetween>
              <Row>
                <ZkAvatar seed={zkAccount?.address} size={20} />
                <Address><ZkName seed={zkAccount?.address} /></Address>
              </Row>
              <TokenContainer>
                <TokenIcon src={zpDaiIcon} />
                {formatNumber(poolBalance)} shDAI
              </TokenContainer>
            </RowSpaceBetween>
          </>
        ) : (
          <RowSpaceBetween>
            <AccountTitle>Zero knowledge account</AccountTitle>
            <Button small onClick={() => change(changeZkAccount)}>Create</Button>
          </RowSpaceBetween>
        )}
      </AccountContainer>
    </Modal>
  );
};

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  margin-bottom: 14px;
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
  margin-left: 8px;
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
  font-size: 20px;
`;
