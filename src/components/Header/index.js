import React, { useRef } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
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
import { ReactComponent as AccountIconDefault } from 'assets/account.svg';
import { ReactComponent as WalletIconDefault } from 'assets/wallet.svg';
import { ReactComponent as DotsIcon } from 'assets/dots.svg';

import { shortAddress, formatNumber } from 'utils';
import { tokenSymbol } from 'utils/token';
import { NETWORKS, CONNECTORS_ICONS } from 'constants';
import { useWindowDimensions } from 'hooks';
import config from 'config';

export default ({
  openWalletModal, connector, isLoadingZkAccount, empty,
  openAccountSetUpModal, account, zkAccount, openConfirmLogoutModal,
  balance, poolBalance, zkAccountId, refresh, isLoadingBalance,
  openSwapModal, generateAddress, openChangePasswordModal,
  openSeedPhraseModal, isDemo, disconnect, isLoadingState,
  switchToPool, currentPool, initializeGiftCard,
}) => {
  const walletButtonRef = useRef(null);
  const zkAccountButtonRef = useRef(null);
  const networkButtonRef = useRef(null);
  const moreButtonRef = useRef(null);
  const { width } = useWindowDimensions();

  if (empty) {
    return (
      <Row>
        <LogoSection>
          <Logo />
        </LogoSection>
      </Row>
    );
  }
  return (
    <Row>
      <LogoSection>
        <Logo />
      </LogoSection>
      <AccountSection>
        <NetworkDropdown
          buttonRef={networkButtonRef}
          disabled={isLoadingState}
          switchToPool={switchToPool}
          currentPool={currentPool}
        >
          <NetworkDropdownButton ref={networkButtonRef} $refreshing={isLoadingState}>
            <NetworkIcon src={NETWORKS[config.pools[currentPool].chainId].icon} />
            <DropdownIcon />
          </NetworkDropdownButton>
        </NetworkDropdown>
        <BridgeButton small onClick={openSwapModal}>
          <LargeButtonContent>Bridge {tokenSymbol()}</LargeButtonContent>
        </BridgeButton>
        {account ? (
          <WalletDropdown
            address={account}
            balance={balance}
            connector={connector}
            changeWallet={openWalletModal}
            disconnect={disconnect}
            buttonRef={walletButtonRef}
            disabled={isLoadingBalance}
            currentChainId={config.pools[currentPool].chainId}
          >
            <AccountDropdownButton ref={walletButtonRef} $refreshing={isLoadingBalance}>
              <Row>
                {connector && <Icon src={CONNECTORS_ICONS[connector.name]} />}
                <Address>{shortAddress(account)}</Address>
                {(isLoadingBalance && width > 1000) ? (
                  <Skeleton width={80} />
                ) : (
                  <>
                    <Balance>
                      {formatNumber(balance)} {tokenSymbol()}
                    </Balance>
                    <DropdownIcon $onlyDesktop />
                  </>
                )}
              </Row>
            </AccountDropdownButton>
          </WalletDropdown>
        ) : (
          <Button small onClick={openWalletModal}>
            <LargeButtonContent>Connect wallet</LargeButtonContent>
            <WalletIcon />
          </Button>
        )}
        {zkAccount ? (
          <>
            <ZkAccountDropdown
              balance={poolBalance}
              generateAddress={generateAddress}
              switchAccount={openAccountSetUpModal}
              changePassword={openChangePasswordModal}
              logout={openConfirmLogoutModal}
              showSeedPhrase={openSeedPhraseModal}
              buttonRef={zkAccountButtonRef}
              isDemo={isDemo}
              isLoadingState={isLoadingState}
              disabled={isLoadingState}
              initializeGiftCard={initializeGiftCard}
            >
              <AccountDropdownButton ref={zkAccountButtonRef} $refreshing={isLoadingState}>
                <Row>
                  <ZkAvatar seed={zkAccountId} size={16} />
                  <Address>zkAccount</Address>
                  {(isLoadingState && width > 1000) ? (
                    <Skeleton width={80} />
                  ) : (
                    <>
                      <Balance>
                        <Tooltip content={formatNumber(poolBalance, 18)} placement="bottom">
                          <span>{formatNumber(poolBalance)}</span>
                        </Tooltip>
                        {' '}{tokenSymbol(true)}
                      </Balance>
                      <DropdownIcon $onlyDesktop />
                    </>
                  )}
                </Row>
              </AccountDropdownButton>
            </ZkAccountDropdown>
            <RefreshButtonContainer onClick={refresh}>
              {(isLoadingBalance || isLoadingState) ? (
                <Spinner size={18} />
              ) : (
                <RefreshIcon />
              )}
            </RefreshButtonContainer>
          </>
        ) : (
          <Button
            small
            $loading={isLoadingZkAccount}
            $contrast
            disabled={isLoadingZkAccount}
            onClick={openAccountSetUpModal}
          >
            <LargeButtonContent>
              {isLoadingZkAccount ? 'Loading zkAccount' : 'Create zkAccount'}
            </LargeButtonContent>
            {!isLoadingZkAccount && <AccountIcon />}
          </Button>
        )}
        <MoreDropdown buttonRef={moreButtonRef} openSwapModal={openSwapModal}>
          <DropdownButton ref={moreButtonRef}>
            <DotsIcon />
          </DropdownButton>
        </MoreDropdown>
      </AccountSection>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
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
    @media only screen and (max-width: 370px) {
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

const NetworkDropdownButton = styled(DropdownButton)`
  padding: 0 8px 0 10px;
`;

const AccountDropdownButton = styled(NetworkDropdownButton)`
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
`;

const Icon = styled.img`
  width: 18px;
  height: 16px;
`;

const Address = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

const Balance = styled.span`
  font-weight: ${props => props.theme.text.weight.extraBold};
  @media only screen and (max-width: 1000px) {
    display: none;
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

const BridgeButton = styled(Button)`
  background: ${props => props.theme.button.link.text.color};
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

const DropdownIcon = styled(DropdownIconDefault)`
  margin-left: 7px;
  @media only screen and (max-width: 1000px) {
    display: ${props => props.$onlyDesktop ? 'none' : 'block'};
  }
`;

const NetworkIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const LargeButtonContent = styled.div`
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

const AccountIcon = styled(AccountIconDefault)`
  display: none;
  @media only screen and (max-width: 1000px) {
    display: block;
  }
`;

const WalletIcon = styled(WalletIconDefault)`
  display: none;
  @media only screen and (max-width: 1000px) {
    display: block;
  }
`;
