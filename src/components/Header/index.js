import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import { ZkAvatar } from 'components/ZkAccountIdentifier';

import { ReactComponent as Logo } from 'assets/logo-beta.svg';
import { ReactComponent as GnosisChainLogoDefault } from 'assets/gnosis-chain-logo.svg';
import { ReactComponent as RefreshIcon } from 'assets/refresh.svg';
import SpinnerDefault from 'components/Spinner';

import { shortAddress, formatNumber } from 'utils';
import { tokenSymbol } from 'utils/token';
import { NETWORKS } from 'constants';

export default ({
  openWalletModal, connector, isLoadingZkAccount, empty,
  openAccountSetUpModal, account, zkAccount, openAccountModal,
  balance, poolBalance, zkAccountId, refresh, isRefreshing,
}) => {
  const logos = {
    100: <GnosisChainLogo />
  }
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
        <NetworkLabel>
          {logos[process.env.REACT_APP_NETWORK] || NETWORKS[process.env.REACT_APP_NETWORK].name}
        </NetworkLabel>
        {account ? (
          <AccountLabel onClick={openAccountModal} $refreshing={isRefreshing}>
            <Row>
              {connector && <Icon src={connector.icon} />}
              <Address>{shortAddress(account)}</Address>
              <Balance>
                <Tooltip content={formatNumber(balance, 18)} placement="bottom">
                  <span>{formatNumber(balance)}</span>
                </Tooltip>
                {' '}{tokenSymbol()}
              </Balance>
            </Row>
          </AccountLabel>
        ) : (
          <Button $small onClick={openWalletModal}>Connect wallet</Button>
        )}
        {zkAccount ? (
          <>
            <AccountLabel onClick={openAccountModal} $refreshing={isRefreshing}>
              <Row>
                <ZkAvatar seed={zkAccountId} size={16} />
                <Address>zkAccount</Address>
                <Balance>
                  <Tooltip content={formatNumber(poolBalance, 18)} placement="bottom">
                    <span>{formatNumber(poolBalance)}</span>
                  </Tooltip>
                  {' '}{tokenSymbol(true)}
                </Balance>
              </Row>
            </AccountLabel>
            <RefreshButtonContainer onClick={refresh}>
              {isRefreshing ? (
                <Spinner size={18} />
              ) : (
                <RefreshIcon />
              )}
            </RefreshButtonContainer>
          </>
        ) : (
          <Button
            $small
            $loading={isLoadingZkAccount}
            $contrast
            disabled={isLoadingZkAccount}
            onClick={openAccountSetUpModal}
          >
            {isLoadingZkAccount ? 'Loading zkAccount' : 'Create zkAccount'}
          </Button>
        )}
        <GetBobLink
          href="https://zkbob.page.link/getBOB"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get {tokenSymbol()}
        </GetBobLink>
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

const AccountSection = styled(Row)`
  justify-content: center;
  & > * {
    margin-left: 10px;
  }
`;

const NetworkLabel = styled(Row)`
  background-color: ${props => props.theme.networkLabel.background};
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  padding: 8px 12px;
  border-radius: 16px;
  height: 30px;
  box-sizing: border-box;
`;

const AccountLabel = styled(NetworkLabel)`
  cursor: pointer;
  overflow: hidden;
  border: 1px solid ${props => props.theme.button.primary.text.color.contrast};
  &:hover {
    border-color: ${props => props.theme.button.link.text.color};
    & span {
      color: ${props => props.theme.button.link.text.color};
    }
  }
`;

const GnosisChainLogo = styled(GnosisChainLogoDefault)`
  width: 18px;
  height: 18px;
`;

const Icon = styled.img`
  width: 18px;
  height: 16px;
`;

const Address = styled.span`
  margin-left: 8px;
`;

const Balance = styled.span`
  margin-left: 8px;
  font-weight: ${props => props.theme.text.weight.extraBold};
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
  border-radius: 16px;
  height: 30px;
  box-sizing: border-box;
  cursor: pointer;
`;

const GetBobLink = styled.a`
  background: transparent;
  border: 1px solid ${props => props.theme.button.link.text.color};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  color: ${props => props.theme.button.link.text.color};
  underline: none;
  text-decoration: none;
  padding: 5px 12px;
  border-radius: 16px;
  height: 30px;
  box-sizing: border-box;
`;
