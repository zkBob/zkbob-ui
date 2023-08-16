import React, { useContext } from 'react';
import styled from 'styled-components';
import { useAccount } from 'wagmi';

import Button from 'components/Button';
import WalletDropdown from 'components/WalletDropdown';

import { ReactComponent as Logo } from 'assets/logo-beta.svg';
import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';

import { shortAddress } from 'utils';

import { CONNECTORS_ICONS, NETWORKS } from 'constants';

import ModalContext from 'contexts/ModalContext';

export default () => {
  const { address: account, connector } = useAccount();
  const { openWalletModal } = useContext(ModalContext);
  return (
    <Header>
      <Logo style={{ marginRight: 10 }} />
      <Row>
        <NetworkLabel>
          <NetworkIcon src={NETWORKS[137].icon} />
          {NETWORKS[137].name}
        </NetworkLabel>
        {account ? (
          <WalletDropdown>
            <AccountDropdownButton>
              <Row>
                {connector && <Icon src={CONNECTORS_ICONS[connector.name]} />}
                <Address>{shortAddress(account)}</Address>
                <DropdownIcon />
              </Row>
            </AccountDropdownButton>
          </WalletDropdown>
        ) : (
          <Button small onClick={openWalletModal} style={{ whiteSpace: 'nowrap' }}>
            Connect wallet
          </Button>
        )}
      </Row>
    </Header>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = styled(Row)`
  justify-content: space-between;
`;

const NetworkLabel = styled(Row)`
  background-color: #FFF;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  padding: 0 12px;
  border-radius: 18px;
  min-height: 36px;
  box-sizing: border-box;
  margin-right: 10px;
  cursor: default;
  &:last-child {
    margin-right: 0;
  }
`;

const DropdownIcon = styled(DropdownIconDefault)`
  width: 16px !important;
  height: 16px;
`;

const AccountDropdownButton = styled(NetworkLabel)`
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${props => props.theme.button.primary.text.color.contrast};
  &:hover {
    border-color: ${props => props.theme.button.link.text.color};
    & span {
      color: ${props => props.theme.button.link.text.color};
    }
    & path {
      stroke: ${props => props.theme.button.link.text.color};
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
  // @media only screen and (max-width: 1100px) {
  //   display: none;
  // }
`;

const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 5px;
`;
