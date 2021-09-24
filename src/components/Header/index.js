import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';

import { ReactComponent as Logo } from 'assets/logo.svg';
import { ReactComponent as XDaiLogoDefault } from 'assets/xdai-logo.svg';
import { ReactComponent as MetaMaskIconDefault } from 'assets/metamask.svg';
import { ReactComponent as ZkIconDefault } from 'assets/zk.svg';

import { shortAddress } from 'utils';

export default ({
  tabs, activeTab, onTabClick, openWalletModal,
  openAccountSetUpModal, account, zkAccount, openAccountModal,
}) => (
  <Row>
    <LogoSection>
      <Logo />
    </LogoSection>
    <TabsSection>
      <Tabs>
        {tabs.map((tab, index) =>
          <Tab
            active={activeTab === index}
            onClick={() => onTabClick(index)}
          >{tab}</Tab>
        )}
      </Tabs>
    </TabsSection>
    <AccountSection>
      <NetworkLabel>
        <XDaiLogo />
        xDai
      </NetworkLabel>
      {account ? (
        <>
          <AccountLabel onClick={openAccountModal}>
            <MetaMaskIcon />
            {shortAddress(account)}
            {zkAccount && (
              <>
                <Divider />
                <ZkIcon />
                {shortAddress(zkAccount)}
              </>
            )}
          </AccountLabel>
          {!zkAccount && (
            <Button small onClick={openAccountSetUpModal}>Set up account</Button>
          )}
        </>
      ) : (
        <Button small onClick={openWalletModal}>Connect wallet</Button>
      )}
    </AccountSection>
  </Row>
);

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

const XDaiLogo = styled(XDaiLogoDefault)`
  margin-right: 8px;
`;

const MetaMaskIcon = styled(MetaMaskIconDefault)`
  width: 18px;
  height: 16px;
  margin-right: 8px;
`;

const ZkIcon = styled(ZkIconDefault)`
  width: 18px;
  height: 14px;
  margin-right: 8px;
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  margin: 0 8px;
  background: ${({ theme }) => theme.input.border};
`;
