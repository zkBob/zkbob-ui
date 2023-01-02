import { useState, useCallback } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import Tooltip from 'components/Tooltip';
import OptionButton from 'components/OptionButton';
import Button from 'components/Button';
import PrivateAddress from 'components/PrivateAddress';

import { formatNumber } from 'utils';
import { tokenIcon, tokenSymbol } from 'utils/token';


const Content = ({
  balance, generateAddress, switchAccount,
  changePassword, logout, buttonRef,
}) => {
  const [privateAddress, setPrivateAddress] = useState(null);

  const generatePrivateAddress = useCallback(async () => {
    setPrivateAddress(await generateAddress());
  }, [generateAddress]);

  const onClick = useCallback(action => {
    buttonRef.current.click();
    action();
  }, [buttonRef])

  return (
    <Container>
      <RowSpaceBetween>
        <SmallText>zkAccount</SmallText>
        <Row>
          <TokenIcon src={tokenIcon()} />
          <Tooltip content={formatNumber(balance, 18)} placement="bottom">
            <Balance>{formatNumber(balance, 6)}</Balance>
          </Tooltip>
          <Balance style={{ marginLeft: 5 }}>{tokenSymbol()}</Balance>
        </Row>
      </RowSpaceBetween>
      {privateAddress ? (
        <PrivateAddress>{privateAddress}</PrivateAddress>
      ) : (
        <Button onClick={generatePrivateAddress}>Generate receiving address</Button>
      )}
      <PrivateAddressDescription>
        Use this address to receive tokens to your zkBob account.{' '}
        You create a new address each time you connect.{' '}
        Receive tokens to this address or a previously generated address.
      </PrivateAddressDescription>
      <OptionButton onClick={() => onClick(changePassword)}>Change password</OptionButton>
      <OptionButton onClick={() => onClick(switchAccount)}>Switch account</OptionButton>
      <OptionButton onClick={() => onClick(logout)}>Log out</OptionButton>
    </Container>
  );
};

export default ({
  balance, generateAddress, switchAccount,
  changePassword, logout, buttonRef, children,
}) => (
  <Dropdown
    content={() => (
      <Content
        balance={balance}
        generateAddress={generateAddress}
        switchAccount={switchAccount}
        changePassword={changePassword}
        logout={logout}
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
  margin-bottom: 20px;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const PrivateAddressDescription = styled.span`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin: 10px 0 20px;
  line-height: 22px;
`;
