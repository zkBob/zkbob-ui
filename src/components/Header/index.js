import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import { ZkAvatar, ZkName } from 'components/ZkAccountIdentifier';

import { ReactComponent as Logo } from 'assets/logo.svg';
import { ReactComponent as GnosisChainLogoDefault } from 'assets/gnosis-chain-logo.svg';
import { ReactComponent as RefreshIcon } from 'assets/refresh.svg';
import SpinnerDefault from 'components/Spinner';

import { shortAddress, formatNumber } from 'utils';
import { tokenSymbol } from 'utils/token';
import { NETWORKS } from 'constants';

export default ({
  openWalletModal, connector, isLoadingZkAccount,
  openAccountSetUpModal, account, zkAccount, openAccountModal,
  balance, poolBalance, zkAccountId, refresh, isRefreshing,
}) => {
  const logos = {
    100: <GnosisChainLogo />
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
        {!account && (
          <Button style={{ marginLeft: 16 }} $small onClick={openWalletModal}>Connect wallet</Button>
        )}
        {(account || zkAccount) && (
          <AccountLabel onClick={openAccountModal}>
            {account && (
              <Row $refreshing={isRefreshing}>
                {connector && <Icon src={connector.icon} />}
                <Address>{shortAddress(account)}</Address>
                <Balance>
                  <Tooltip content={balance} placement="bottom">
                    <span>{formatNumber(balance)}</span>
                  </Tooltip>
                  {' '}{tokenSymbol()}
                </Balance>
              </Row>
            )}
            {(account && zkAccount) && <Divider />}
            {zkAccount && (
              <>
                <Row $refreshing={isRefreshing}>
                  <ZkAvatar seed={zkAccountId} size={16} />
                  <Address><ZkName seed={zkAccountId} /></Address>
                  <Balance>
                    <Tooltip content={poolBalance} placement="bottom">
                      <span>{formatNumber(poolBalance)}</span>
                    </Tooltip>
                    {' '}{tokenSymbol(true)}
                  </Balance>
                </Row>
                <Divider />
                <RefreshButtonContainer onClick={refresh}>
                  {isRefreshing ? (
                    <Spinner size={18} />
                  ) : (
                    <RefreshIcon />
                  )}
                </RefreshButtonContainer>
              </>
            )}
          </AccountLabel>
        )}
        {!zkAccount && (
          <Button
            $small
            $loading={isLoadingZkAccount}
            $contrast
            disabled={isLoadingZkAccount}
            onClick={openAccountSetUpModal}
            style={{ marginLeft: 16 }}
          >
            {isLoadingZkAccount ? 'Loading zkAccount' : 'zkAccount'}
          </Button>
        )}
        <GetBobLink
          href="https://docs.zkbob.com/"
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
  opacity: ${props => props.$refreshing ? 0.2 : 1};
`;

const LogoSection = styled(Row)`
  justify-content: flex-start;
`;

const AccountSection = styled(Row)`
  justify-content: center;
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
  margin-left: 16px;
`;

const GnosisChainLogo = styled(GnosisChainLogoDefault)`
  width: 18px;
  height: 18px;
`;

const Icon = styled.img`
  width: 18px;
  height: 16px;
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  margin: 0 8px;
  background: ${({ theme }) => theme.input.border.color.default};
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

const RefreshButtonContainer = styled.div`
  height: 18px;
  margin: -6px -12px -6px -8px;
  padding: 6px 12px 6px 8px;
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
  margin-left: 16px;
  height: 30px;
  box-sizing: border-box;
`;
