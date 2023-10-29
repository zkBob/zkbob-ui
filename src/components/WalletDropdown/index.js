import { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import Tooltip from 'components/Tooltip';
import OptionButton from 'components/OptionButton';
import ShortAddress from './ShortAddress';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

import { formatNumber } from 'utils';

import { CONNECTORS_ICONS, NETWORKS, TOKENS_ICONS } from 'constants';

import { ModalContext, TokenBalanceContext, PoolContext, WalletContext } from 'contexts';


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
  const { t } = useTranslation();
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
        <SmallText>{t('common.wallet')}</SmallText>
        {currentPool && (
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
        )}
      </RowSpaceBetween>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <AddressContainer>
          {connector && <Icon src={CONNECTORS_ICONS[connector.name]} />}
          <ShortAddress address={address} />
          <Tooltip content={t('common.copied')} placement="right" visible={isCopied}>
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </Tooltip>
        </AddressContainer>
      </CopyToClipboard>
      {currentPool && (
        <OptionButton
          type="link"
          href={NETWORKS[currentPool.chainId].blockExplorerUrls.address.replace('%s', address)}
        >
          {t('common.viewInExplorer')}
        </OptionButton>
      )}
      <OptionButton onClick={onChangeWallet}>
        {t('buttonText.changeWallet')}
      </OptionButton>
      <OptionButton onClick={onDisconnect}>
        {t('buttonText.disconnect')}
      </OptionButton>
    </Container>
  );
};

export default ({ children }) => {
  const { address, connector, disconnect } = useContext(WalletContext);
  const { balance, nativeBalance, isLoadingBalance } = useContext(TokenBalanceContext);
  const {
    openWalletModal, isWalletDropdownOpen,
    openWalletDropdown, closeWalletDropdown,
  } = useContext(ModalContext);
  const { currentPool } = useContext(PoolContext);
  return (
    <Dropdown
      disabled={isLoadingBalance}
      isOpen={isWalletDropdownOpen}
      open={openWalletDropdown}
      close={closeWalletDropdown}
      content={() => (
        <Content
          address={address}
          balance={balance}
          nativeBalance={nativeBalance}
          connector={connector}
          changeWallet={openWalletModal}
          disconnect={disconnect}
          currentPool={currentPool}
          close={closeWalletDropdown}
        />
      )}
    >
      {children}
    </Dropdown>
  );
};

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
