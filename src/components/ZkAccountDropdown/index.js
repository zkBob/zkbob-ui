import { useState, useCallback } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { isMobile } from 'react-device-detect';

import Dropdown from 'components/Dropdown';
import Tooltip from 'components/Tooltip';
import OptionButton from 'components/OptionButton';
import Button from 'components/Button';
import PrivateAddress from 'components/PrivateAddress';

import { ReactComponent as BackIconDefault } from 'assets/back.svg';

import { formatNumber } from 'utils';
import { tokenIcon, tokenSymbol } from 'utils/token';


const Content = ({
  balance, generateAddress, switchAccount, isDemo,
  changePassword, logout, buttonRef, showSeedPhrase,
  isLoadingState,
}) => {
  const [privateAddress, setPrivateAddress] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const generatePrivateAddress = useCallback(async () => {
    setPrivateAddress(await generateAddress());
  }, [generateAddress]);

  const generateQRCode = useCallback(async () => {
    await generatePrivateAddress();
    setShowQRCode(true);
  }, [generatePrivateAddress]);

  const closeQRCode = useCallback(() => {
    setPrivateAddress(null);
    setShowQRCode(false);
  }, []);

  const handleOptionClick = useCallback(action => {
    buttonRef.current.click();
    action();
  }, [buttonRef]);

  const options = [
    { text: 'Change password', action: changePassword },
    { text: 'Show secret recovery phrase', action: showSeedPhrase },
    { text: 'Switch account', action: switchAccount },
    { text: 'Log out', action: logout },
  ];

  if (showQRCode) {
    return (
      <Container>
        <BackIcon onClick={closeQRCode} />
        <Title>QR code address</Title>
        <Description>
          To receive a private transfer from another zkAccount, your friend can scan this code from their app.<br />
          The other user just has to scan your QR code on the Transfer page
        </Description>
        <QRCode
          value={privateAddress}
          style={{ alignSelf: 'center' }}
        />
      </Container>
    );
  }

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
      {isMobile &&
        <Button style={{ marginBottom: 10 }} onClick={generateQRCode} disabled={isLoadingState}>
          Generate QR code address
        </Button>
      }
      {privateAddress ? (
        <PrivateAddress>{privateAddress}</PrivateAddress>
      ) : (
        <Button onClick={generatePrivateAddress} disabled={isLoadingState}>
          Generate receiving address
        </Button>
      )}
      <Description>
        Use this address to receive tokens to your zkBob account.{' '}
        You create a new address each time you connect.{' '}
        Receive tokens to this address or a previously generated address.
      </Description>
      {options.map((item, index) =>
        <OptionButton
          key={index}
          onClick={() => handleOptionClick(item.action)}
          disabled={isDemo}
        >
          {item.text}
        </OptionButton>
      )}
    </Container>
  );
};

export default ({
  balance, generateAddress, switchAccount, showSeedPhrase,
  changePassword, logout, buttonRef, children, isDemo, isLoadingState,
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
        showSeedPhrase={showSeedPhrase}
        isDemo={isDemo}
        isLoadingState={isLoadingState}
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

const Description = styled.span`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin: 10px 0 20px;
  line-height: 22px;
`;

const BackIcon = styled(BackIconDefault)`
  position: absolute;
  top: 34px;
  left: 11px;
  cursor: pointer;
  padding: 10px;
`;

const Title = styled.span`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
`;
