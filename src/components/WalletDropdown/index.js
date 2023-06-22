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


const Balance = ({ tokenSymbol, balance, isWrapped, isNative }) => (
  <Row>
    <TokenIcon
      src={TOKENS_ICONS[(isWrapped ? 'W' : '') + tokenSymbol]}
      style={{ marginRight: isWrapped || isNative ? 4 : 8 }}
    />
    <Tooltip content={formatNumber(balance, 18)} placement="bottom">
      <Text>{formatNumber(balance, isWrapped || isNative ? 4 : 6)}</Text>
    </Tooltip>
    <Text style={{ marginLeft: 5 }}>{isWrapped ? 'W' : ''}{tokenSymbol}</Text>
  </Row>
);


const Content = ({
  address, balance, nativeBalance, connector, changeWallet,
  disconnect, buttonRef, currentPool,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  const onChangeWallet = useCallback(() => {
    buttonRef.current.click();
    changeWallet();
  }, [changeWallet, buttonRef]);

  const onDisconnect = useCallback(() => {
    buttonRef.current.click();
    disconnect();
  }, [disconnect, buttonRef]);

  return (
    <Container>
      <RowSpaceBetween>
        <SmallText>Wallet</SmallText>
        <Row>
          {currentPool.isNativeToken && (
            <>
              <Balance tokenSymbol={currentPool.tokenSymbol} balance={nativeBalance} isNative />
              <Text style={{ margin: '0 4px' }}>+</Text>
            </>
          )}
          <Balance tokenSymbol={currentPool.tokenSymbol} balance={balance} isWrapped={currentPool.isNativeToken} />
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
  disconnect, buttonRef, children, disabled,
  currentPool,
}) => (
  <Dropdown
    disabled={disabled}
    content={() => (
      <Content
        address={address}
        balance={balance}
        nativeBalance={nativeBalance}
        connector={connector}
        changeWallet={changeWallet}
        disconnect={disconnect}
        buttonRef={buttonRef}
        currentPool={currentPool}
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
