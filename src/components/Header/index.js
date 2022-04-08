import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Link from 'components/Link';
import { ZkAvatar, ZkName } from 'components/ZkAccountIdentifier';

import { ReactComponent as Logo } from 'assets/logo.svg';
import { ReactComponent as GnosisChainLogoDefault } from 'assets/gnosis-chain-logo.svg';
import { ReactComponent as ZkIconDefault } from 'assets/zk.svg';
import { ReactComponent as ExternalLinkIconDefault } from 'assets/external-link.svg';

import { shortAddress } from 'utils';
import { NETWORKS } from 'constants';

export default ({
  tabs, activeTab, onTabClick, openWalletModal, connector, isLoadingZkAccount,
  openAccountSetUpModal, account, zkAccount, openAccountModal,
}) => {
  const logos = {
    100: <GnosisChainLogo />
  }
  return (
    <Row>
      <LogoSection>
        <Logo />
      </LogoSection>
      <TabsSection>
        <Tabs>
          {tabs.map((tab, index) =>
            <Tab
              key={index}
              active={activeTab === index}
              onClick={() => onTabClick(index)}
            >{tab}</Tab>
          )}
          <BridgeLink href="https://omni.xdaichain.com/">
            Bridge
            <ExternalLinkIcon />
          </BridgeLink>
        </Tabs>
      </TabsSection>
      <AccountSection>
        <NetworkLabel>
          {logos[process.env.REACT_APP_NETWORK] || NETWORKS[process.env.REACT_APP_NETWORK].name}
        </NetworkLabel>
        {!account && (
          <ConnectButton small onClick={openWalletModal}>Connect wallet</ConnectButton>
        )}
        {(account || zkAccount) && (
          <AccountLabel onClick={openAccountModal}>
            {account && (
              <>
                {connector && <Icon src={connector.icon} />}
                <Address>{shortAddress(account)}</Address>
              </>
            )}
            {(account && zkAccount) && <Divider />}
            {zkAccount && (
              <>
                <ZkAvatar seed={zkAccount?.address} size={16} />
                <Address><ZkName seed={zkAccount?.address} /></Address>
              </>
            )}
          </AccountLabel>
        )}
        {!zkAccount && (
          <Button
            small
            contrast
            loading={isLoadingZkAccount}
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
`;

const LogoSection = styled(Row)`
  flex: 1;
  justify-content: flex-start;
`;

const TabsSection = styled(Row)`
  flex: 1;
  justify-content: center;
`;

const AccountSection = styled(Row)`
  flex: 1;
  justify-content: center;
`;

const Tabs = styled(Row)`
  background-color: ${props => props.theme.tab.background.default};
  border-radius: 16px;
  padding: 8px;
  width: 480px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  & > * {
    flex: 1;
  }
`;

const Tab = styled.div`
  border-radius: 10px;
  padding: 8px 16px;
  background-color: ${props => props.theme.tab.background[props.active ? 'active' : 'default']};
  color: ${props => props.theme.text.color[props.active ? 'primary' : 'secondary']};
  font-weight: ${props => props.theme.text.weight[props.active ? 'bold' : 'normal']};
  cursor: pointer;
`;

const NetworkLabel = styled(Row)`
  background-color: ${props => props.theme.networkLabel.background};
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  padding: 8px 12px;
  border-radius: 10px;
  margin-right: 16px;
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
  background: ${({ theme }) => theme.input.border};
`;

const BridgeLink = styled(Link)`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  padding: 0 16px;
  position: relative;
  margin-right: 17px;
`;

const ExternalLinkIcon = styled(ExternalLinkIconDefault)`
  position: absolute;
  right: 0;
  top: 1px;
`;

const ConnectButton = styled(Button)`
  margin-right: 16px;
`;

const Address = styled.span`
  margin-left: 8px;
`;
