import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useAccount, useDisconnect } from 'wagmi';

import ButtonDefault from 'components/Button';
import { ZkAvatar } from 'components/ZkAccountIdentifier';
import WalletDropdown from 'components/WalletDropdown';
import ZkAccountDropdown from 'components/ZkAccountDropdown';
import NetworkDropdown from 'components/NetworkDropdown';
import MoreDropdown from 'components/MoreDropdown';
import SpinnerDefault from 'components/Spinner';
import Skeleton from 'components/Skeleton';

import { ReactComponent as LogoDefault } from 'assets/logo-beta.svg';
import { ReactComponent as RefreshIcon } from 'assets/refresh.svg';
import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';
import { ReactComponent as DotsIcon } from 'assets/dots.svg';

import { shortAddress, formatNumber } from 'utils';
import { NETWORKS, CONNECTORS_ICONS, TOKENS_ICONS } from 'constants';
import { useWindowDimensions } from 'hooks';

import {
  ZkAccountContext, ModalContext,
  TokenBalanceContext, PoolContext,
} from 'contexts';

const { parseUnits } = ethers.utils;

const formatBalance = (balance, tokenDecimals, isMobile) => {
  const decimals = (isMobile && balance.gte(parseUnits('1000', tokenDecimals))) ? 0 : null;
  return formatNumber(balance, tokenDecimals, decimals);
};

const BalanceSkeleton = isMobile => (
  <Skeleton
    width={isMobile ? 60 : 80}
    style={{ marginLeft: isMobile ? 5 : 0 }}
  />
);

export default ({ empty }) => {
  const { address: account, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, nativeBalance, updateBalance, isLoadingBalance } = useContext(TokenBalanceContext);
  const {
    zkAccount, isLoadingZkAccount, balance: poolBalance,
    updatePoolData, generateAddress, isDemo, isPoolSwitching,
    isLoadingState, switchToPool, initializeGiftCard, getSeed,
  } = useContext(ZkAccountContext);
  const {
    openWalletModal, openSeedPhraseModal,
    openAccountSetUpModal, openSwapModal,
    openChangePasswordModal, openConfirmLogoutModal,
    openDisablePasswordModal,
    isNetworkDropdownOpen, openNetworkDropdown, closeNetworkDropdown,
    isWalletDropdownOpen, openWalletDropdown, closeWalletDropdown,
    isZkAccountDropdownOpen, openZkAccountDropdown, closeZkAccountDropdown,
    isMoreDropdownOpen, openMoreDropdown, closeMoreDropdown,
  } = useContext(ModalContext);
  const { currentPool } = useContext(PoolContext);

  const refresh = useCallback(e => {
    e.stopPropagation();
    updateBalance();
    updatePoolData();
  }, [updateBalance, updatePoolData]);

  const { width } = useWindowDimensions();

  const isMobile = width <= 800;

  if (empty) {
    return (
      <Row>
        <LogoSection>
          <Logo />
        </LogoSection>
      </Row>
    );
  }

  const networkDropdown = (
    <NetworkDropdown
      disabled={isPoolSwitching || isLoadingState}
      switchToPool={switchToPool}
      currentPool={currentPool}
      isOpen={isNetworkDropdownOpen}
      open={openNetworkDropdown}
      close={closeNetworkDropdown}
    >
      <NetworkDropdownButton $refreshing={isPoolSwitching || isLoadingState}>
        <NetworkIcon src={NETWORKS[currentPool.chainId].icon} />
        <Divider />
        <NetworkIcon src={TOKENS_ICONS[currentPool.tokenSymbol]} />
        {isPoolSwitching ? (
          <Spinner size={12} style={{ marginLeft: 10 }} />
        ) : (
          <DropdownIcon />
        )}
      </NetworkDropdownButton>
    </NetworkDropdown>
  );

  const walletDropdown = account ? (
    <WalletDropdown
      address={account}
      balance={balance}
      nativeBalance={nativeBalance}
      connector={connector}
      changeWallet={openWalletModal}
      disconnect={disconnect}
      disabled={isLoadingBalance}
      currentPool={currentPool}
      isOpen={isWalletDropdownOpen}
      open={openWalletDropdown}
      close={closeWalletDropdown}
    >
      <AccountDropdownButton $refreshing={isLoadingBalance}>
        <Row>
          {connector && <Icon src={CONNECTORS_ICONS[connector.name]} />}
          <Address>{shortAddress(account)}</Address>
          {isLoadingBalance ? (
            <BalanceSkeleton isMobile={isMobile} />
          ) : (
            <>
              <Balance>
                {formatBalance(
                  currentPool.isNative ? nativeBalance.add(balance) : balance,
                  currentPool.tokenDecimals,
                  isMobile
                )}{' '}
                {currentPool.tokenSymbol}{currentPool.isNative && '*'}
              </Balance>
              <DropdownIcon />
            </>
          )}
        </Row>
      </AccountDropdownButton>
    </WalletDropdown>
  ) : (
    <Button small onClick={openWalletModal}>
      Connect wallet
    </Button>
  );

  const zkAccountDropdown = zkAccount ? (
    <ZkAccountDropdown
      balance={poolBalance}
      generateAddress={generateAddress}
      switchAccount={openAccountSetUpModal}
      setPassword={openChangePasswordModal}
      removePassword={openDisablePasswordModal}
      logout={openConfirmLogoutModal}
      showSeedPhrase={openSeedPhraseModal}
      isDemo={isDemo}
      isLoadingState={isLoadingState}
      disabled={isLoadingState}
      initializeGiftCard={initializeGiftCard}
      getSeed={getSeed}
      currentPool={currentPool}
      isOpen={isZkAccountDropdownOpen}
      open={openZkAccountDropdown}
      close={closeZkAccountDropdown}
    >
      <AccountDropdownButton $refreshing={isLoadingState}>
        <Row>
          <ZkAvatar seed={zkAccount} size={16} />
          <Address>zkAccount</Address>
          {isLoadingState ? (
            <BalanceSkeleton isMobile={isMobile} />
          ) : (
            <>
              <Balance>
                {formatBalance(poolBalance, currentPool.tokenDecimals, isMobile)} {currentPool.tokenSymbol}
              </Balance>
              <DropdownIcon />
            </>
          )}
        </Row>
      </AccountDropdownButton>
    </ZkAccountDropdown>
  ) : (
    <Button
      small
      loading={isLoadingZkAccount}
      contrast
      disabled={isLoadingZkAccount}
      onClick={openAccountSetUpModal}
    >
      {isLoadingZkAccount ? (isMobile ? 'Loading' : 'Loading zkAccount') : 'zkAccount'}
    </Button>
  );

  return (
    <>
      <Row>
        <LogoSection>
          <Logo />
        </LogoSection>
        <AccountSection>
          {!isMobile && networkDropdown}
          <BridgeButton small onClick={openSwapModal}>
            Get {currentPool.tokenSymbol}
          </BridgeButton>
          {!isMobile && walletDropdown}
          {!isMobile && zkAccountDropdown}
          {(zkAccount && !isMobile) && (
            <RefreshButtonContainer onClick={refresh}>
              {(isLoadingBalance || isLoadingState) ? (
                <Spinner size={18} />
              ) : (
                <RefreshIcon />
              )}
            </RefreshButtonContainer>
          )}
          <MoreDropdown
            isOpen={isMoreDropdownOpen}
            open={openMoreDropdown}
            close={closeMoreDropdown}
          >
            <DropdownButton>
              <DotsIcon />
            </DropdownButton>
          </MoreDropdown>
        </AccountSection>
      </Row>
      {isMobile && (
        <OnlyMobile>
          {networkDropdown}
          {walletDropdown}
          {zkAccountDropdown}
        </OnlyMobile>
      )}
    </>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const OnlyMobile = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  padding: 0 7px;
  background: #fff;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * {
    margin-right: 2px;
    margin-left: 2px;
    &:last-child {
      margin-right: 0;
    }
    &:first-child {
      margin-left: 0;
    }
  }
`;

const LogoSection = styled(Row)`
  justify-content: flex-start;
`;

const Logo = styled(LogoDefault)`
  @media only screen and (max-width: 1000px) {
    height: 20px;
    width: 100px;
    margin-left: 10px;
  }
`;

const AccountSection = styled(Row)`
  justify-content: center;
  & > * {
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }
    @media only screen and (max-width: 400px) {
      margin-left: 7px;
    }
    @media only screen and (max-width: 380px) {
      margin-left: 5px;
    }
  }
`;

const DropdownButton = styled(Row)`
  background-color: ${props => props.theme.networkLabel.background};
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  padding: 0 8px;
  border-radius: 18px;
  min-height: 36px;
  box-sizing: border-box;
  cursor: ${props => props.$refreshing ? 'not-allowed' : 'pointer'};
  @media only screen and (max-width: 1000px) {
    min-height: 30px;
    border-radius: 16px;
  }
`;

const DropdownIcon = styled(DropdownIconDefault)`
  width: 16px !important;
  height: 16px;
  margin-left: 7px;
  @media only screen and (max-width: 800px) {
    margin-left: 4px;
  }
`;

const NetworkDropdownButton = styled(DropdownButton)`
  padding: 0 8px 0 10px;
  @media only screen and (max-width: 800px) {
    padding: 0;
    background-color: transparent;
  }
`;

const AccountDropdownButton = styled(NetworkDropdownButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.button.primary.text.color.contrast};
  &:hover {
    border-color: ${props => !props.$refreshing && props.theme.button.link.text.color};
    & span {
      color: ${props => !props.$refreshing && props.theme.button.link.text.color};
    }
    & path {
      stroke: ${props => !props.$refreshing && props.theme.button.link.text.color};
    }
  }
  @media only screen and (max-width: 800px) {
    flex: 1;
    padding: 0 2px 0 7px;
    ${DropdownIcon} {
      margin-left: 2px;
    }
  }
`;

const Icon = styled.img`
  width: 18px;
  height: 16px;
`;

const Address = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  @media only screen and (max-width: 1100px) {
    display: none;
  }
`;

const Balance = styled.span`
  font-weight: ${props => props.theme.text.weight.extraBold};
  @media only screen and (max-width: 1100px) {
    margin-left: 8px;
  }
  @media only screen and (max-width: 800px) {
    font-weight: ${props => props.theme.text.weight.bold};
    font-size: 14px;
  }
`;

const Spinner = styled(SpinnerDefault)`
  path {
    stroke: ${props => props.theme.text.color.primary};
    stroke-width: 10;
  }
  circle {
    stroke: #FFF;
    stroke-width: 10;
  }
`;

const RefreshButtonContainer = styled(Row)`
  background-color: ${props => props.theme.networkLabel.background};
  padding: 8px 12px;
  border-radius: 18px;
  height: 36px;
  box-sizing: border-box;
  cursor: pointer;
  @media only screen and (max-width: 1000px) {
    height: 30px;
    border-radius: 16px;
  }
`;

const Button = styled(ButtonDefault)`
  @media only screen and (max-width: 800px) {
    font-size: 14px;
    flex: 1;
    padding: 8px 5px;
  }
`;

const BridgeButton = styled(Button)`
  background: ${props => props.theme.button.link.text.color};
  @media only screen and (max-width: 800px) {
    padding: 8px 12px;
  }
`;

const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Divider = styled.span`
  ::before {
    content: '/';
    font-size: 16px;
    color: ${props => props.theme.text.color.primary};
    margin: 0 4px;
  }
`;
