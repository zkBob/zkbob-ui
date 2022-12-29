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
import { tokenIcon, tokenSymbol } from 'utils/token';


const Content = ({ address, balance, connector, changeWallet, buttonRef }) => {
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

  return (
    <Container>
      <RowSpaceBetween>
        <SmallText>Wallet</SmallText>
        <Row>
          <TokenIcon src={tokenIcon()} />
          <Tooltip content={formatNumber(balance, 18)} placement="bottom">
            <Balance>{formatNumber(balance, 6)}</Balance>
          </Tooltip>
          <Balance style={{ marginLeft: 5 }}>{tokenSymbol()}</Balance>
        </Row>
      </RowSpaceBetween>
      <CopyToClipboard text={address} onCopy={onCopy}>
        <AddressContainer>
          {connector?.icon && <Icon src={connector.icon} />}
          <ShortAddress address={address} />
          <Tooltip content="Copied" placement="right" visible={isCopied}>
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </Tooltip>
        </AddressContainer>
      </CopyToClipboard>
      <OptionButton
        type="link"
        href={process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', address)}
      >
        View in Explorer
      </OptionButton>
      <OptionButton onClick={onChangeWallet}>Change wallet</OptionButton>
    </Container>
  );
};

export default ({ address, balance, connector, changeWallet, buttonRef, children }) => (
  <Dropdown
    content={() => (
      <Content
        address={address}
        balance={balance}
        connector={connector}
        changeWallet={changeWallet}
        buttonRef={buttonRef}
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

const Balance = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
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
