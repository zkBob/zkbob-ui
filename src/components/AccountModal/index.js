import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Link from 'components/Link';
import ZkAccountIdentifier from 'components/ZkAccountIdentifier';

import zkIcon from 'assets/zk.svg';

import { shortAddress } from 'utils';

export default ({
  isOpen, onClose, account = '', zkAccount,
  changeAccount, changeZkAccount, connector,
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
        <RowSpaceBetween>
          <AccountTitle>Connected with {connector?.name}</AccountTitle>
          <Button type="link" onClick={() => change(changeAccount)}>
            {account ? 'Change' : 'Set up account'}
          </Button>
        </RowSpaceBetween>
        <Row>
          {account ? (
            <>
              {connector?.icon && <Icon src={connector.icon} />}
              <Address>{shortAddress(account)}</Address>
            </>
          ) : (
            <Address>-</Address>
          )}
        </Row>
        {account && (
          <Row>
            <CopyToClipboard text={account} style={{ marginRight: 16 }}>
              <Button type="link">Copy address</Button>
            </CopyToClipboard>
            <Link href={process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', account)}>
              View in Explorer
            </Link>
          </Row>
        )}
      </AccountContainer>
      <AccountContainer>
        <RowSpaceBetween>
          <AccountTitle>Zero knowledge account</AccountTitle>
          <Button type="link" onClick={() => change(changeZkAccount)}>
            {zkAccount ? 'Change' : 'Set up account'}
          </Button>
        </RowSpaceBetween>
        <Row>
          {zkAccount ? (
            <>
              <Icon src={zkIcon} />
              <ZkAccountIdentifier seed={zkAccount?.address} size={24} />
            </>
          ) : (
            <Address>-</Address>
          )}
        </Row>
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
  margin-bottom: 14px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const RowSpaceBetween = styled(Row)`
  width: 100%;
  justify-content: space-between;
`;

const AccountTitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.secondary};
`;

const Address = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;
