import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { ZkAvatar, ZkName } from 'components/ZkAccountIdentifier';

import { ReactComponent as Logo } from 'assets/logo.svg';
import { ReactComponent as GnosisChainLogoDefault } from 'assets/gnosis-chain-logo.svg';

import { shortAddress, formatNumber } from 'utils';
import { NETWORKS } from 'constants';

export default ({
  openWalletModal, connector, isLoadingZkAccount,
  openAccountSetUpModal, account, zkAccount, openAccountModal,
  balance, poolBalance, zkAccountId,
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
          <Button style={{ marginRight: 16 }} $small onClick={openWalletModal}>Connect wallet</Button>
        )}
        {(account || zkAccount) && (
          <AccountLabel onClick={openAccountModal}>
            {account && (
              <>
                {connector && <Icon src={connector.icon} />}
                <Address>{shortAddress(account)}</Address>
                <Balance>{formatNumber(balance)} DAI</Balance>
              </>
            )}
            {(account && zkAccount) && <Divider />}
            {zkAccount && (
              <>
                <ZkAvatar seed={zkAccountId} size={16} />
                <Address><ZkName seed={zkAccountId} /></Address>
                <Balance>{formatNumber(poolBalance)} shDAI</Balance>
              </>
            )}
          </AccountLabel>
        )}
        {!zkAccount && (
          <Button
            $small
            $loading={isLoadingZkAccount}
            disabled={isLoadingZkAccount}
            onClick={openAccountSetUpModal}
          >
            {isLoadingZkAccount ? 'Loading account' : 'Set up account'}
          </Button>
        )}
      </AccountSection>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  margin-right: 16px;
  height: 30px;
  box-sizing: border-box;
`;

const AccountLabel = styled(NetworkLabel)`
  cursor: pointer;
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
