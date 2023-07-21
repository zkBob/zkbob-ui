import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Dropdown from 'components/Dropdown';
import Tooltip from 'components/Tooltip';
import OptionButton from 'components/OptionButton';
import ShortAddress from './ShortAddress';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

import { formatNumber } from 'utils';

import { CONNECTORS_ICONS, NETWORKS, TOKENS_ICONS } from 'constants';


const Balance = ({ tokenSymbol, balance, isWrapped, isNative, tokenDecimals }) => (
  <Row>
    <TokenIcon
      src={TOKENS_ICONS[(isWrapped ? 'W' : '') + tokenSymbol]}
      style={{ marginRight: isWrapped || isNative ? 4 : 8 }}
    />
    <Tooltip content={formatNumber(balance, tokenDecimals, 18)} placement="bottom">
      <Text>{formatNumber(balance, tokenDecimals, isWrapped || isNative ? 4 : 6)}</Text>
    </Tooltip>
    <Text style={{ marginLeft: 5 }}>{isWrapped ? 'W' : ''}{tokenSymbol}</Text>
  </Row>
);


const Content = ({
  address, balance, nativeBalance, connector, changeWallet,
  disconnect, close, currentPool,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  const onChangeWallet = useCallback(() => {
    close();
    changeWallet();
  }, [changeWallet, close]);

  const onDisconnect = useCallback(() => {
    close();
    disconnect();
  }, [disconnect, close]);

  return (
    <Container>
      <RowSpaceBetween>
        <SmallText>Wallet</SmallText>
        <Row>
          {currentPool.isNative && (
            <>
              <Balance
                tokenSymbol={currentPool.tokenSymbol}
                tokenDecimals={currentPool.tokenDecimals}
                balance={nativeBalance}
                isNative
              />
              <Text style={{ margin: '0 4px' }}>+</Text>
            </>
          )}
          <Balance
            tokenSymbol={currentPool.tokenSymbol}
            tokenDecimals={currentPool.tokenDecimals}
            balance={balance}
            isWrapped={currentPool.isNative}
          />
        </Row>
      </RowSpaceBetween>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <AddressContainer>
          {connector && <Icon src={CONNECTORS_ICONS[connector.name]} />}
          <ShortAddress address={address} />
          <Tooltip content="Copied" placement="right" visible={isCopied}>
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </Tooltip>
        </AddressContainer>
      </CopyToClipboard>
      <OptionButton
        type="link"
        href={NETWORKS[currentPool.chainId].blockExplorerUrls.address.replace('%s', address)}
      >
        View in Explorer
      </OptionButton>
      <OptionButton onClick={onChangeWallet}>Change wallet</OptionButton>
      <OptionButton onClick={onDisconnect}>Disconnect</OptionButton>
    </Container>
  );
};

export default ({
  address, balance, nativeBalance, connector, changeWallet,
  disconnect, children, disabled, currentPool, isOpen, open, close,
}) => (
  <Dropdown
    disabled={disabled}
    isOpen={isOpen}
    open={open}
    close={close}
    content={() => (
      <Content
        address={address}
        balance={balance}
        nativeBalance={nativeBalance}
        connector={connector}
        changeWallet={changeWallet}
        disconnect={disconnect}
        currentPool={currentPool}
        close={close}
      />
    )}
  >
    {children}
  </Dropdown>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const SmallText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
`;

const Text = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

const CopyIcon = styled(CopyIconDefault)``;

const AddressContainer = styled(Row)`
  width: 100%;
  cursor: pointer;
  margin: 30px 0 35px;
  align-self: flex-start;
  &:hover ${CopyIcon} {
    path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
