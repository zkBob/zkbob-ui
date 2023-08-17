import { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';

import Dropdown from 'components/Dropdown';
import Tooltip from 'components/Tooltip';
import OptionButton from 'components/OptionButton';
import Button from 'components/Button';
import PrivateAddress from 'components/PrivateAddress';
import QRCodeReader from 'components/QRCodeReader';

import { ReactComponent as BackIconDefault } from 'assets/back.svg';

import { formatNumber } from 'utils';

import { TOKENS_ICONS } from 'constants';

import { ZkAccountContext, ModalContext, PoolContext } from 'contexts';

const Content = ({
  balance, generateAddress, getSeed, setPassword,
  removePassword, logout, close, showSeedPhrase,
  isLoadingState, initializeGiftCard, currentPool,
  generatePaymentLink,
}) => {
  const [privateAddress, setPrivateAddress] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { hasPassword } = getSeed();

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

  const initGiftCard = useCallback(async result => {
    try {
      const paramsString = result.split('?')[1];
      const queryParams = new URLSearchParams(paramsString);
      const code = queryParams.get('gift-code');
      await initializeGiftCard(code);
      close();
    } catch (error) {
      console.log(error);
    }
  }, [initializeGiftCard, close]);

  const handleOptionClick = useCallback(action => {
    close();
    action();
  }, [close]);

  const settingsOptions = [
    {
      text: 'Show secret phrase',
      action: showSeedPhrase,
      gaIdPostfix: 'secret-phrase',
    },
    {
      text: `${hasPassword ? 'Disable' : 'Set'} password`,
      action: hasPassword ? removePassword : setPassword,
      gaIdPostfix: `${hasPassword ? 'disable' : 'enable'}-password`,
    },
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

  if (showSettings) {
    return (
      <Container>
        <BackIcon onClick={() => setShowSettings(false)} />
        <Title style={{ marginBottom: 20 }}>Settings</Title>
        {settingsOptions.map((item, index) =>
          <OptionButton
            key={index}
            onClick={() => handleOptionClick(item.action)}
            data-ga-id={`zkaccount-settings-${item.gaIdPostfix}`}
          >
            {item.text}
          </OptionButton>
        )}
      </Container>
    )
  }

  return (
    <Container>
      <RowSpaceBetween>
        <SmallText>zkAccount</SmallText>
        <Row>
          <TokenIcon src={TOKENS_ICONS[currentPool.tokenSymbol]} />
          <Tooltip content={formatNumber(balance, currentPool.tokenDecimals, 18)} placement="bottom">
            <Balance>{formatNumber(balance, currentPool.tokenDecimals, 6)}</Balance>
          </Tooltip>
          <Balance style={{ marginLeft: 5 }}>{currentPool.tokenSymbol}</Balance>
        </Row>
      </RowSpaceBetween>
      <Button
        style={{ marginBottom: 10 }}
        onClick={generateQRCode}
        disabled={isLoadingState}
        data-ga-id="zkaccount-generate-qr-code"
      >
        Generate QR code address
      </Button>
      {privateAddress ? (
        <PrivateAddress>{privateAddress}</PrivateAddress>
      ) : (
        <Button
          onClick={generatePrivateAddress}
          disabled={isLoadingState}
          data-ga-id="zkaccount-generate-address"
        >
          Generate receiving address
        </Button>
      )}
      <Description>
        Use this address to receive tokens to your zkBob account.{' '}
        You create a new address each time you connect.{' '}
        Receive tokens to this address or a previously generated address.
      </Description>
      {currentPool.paymentContractAddress && (
        <OptionButton onClick={() => handleOptionClick(generatePaymentLink)} data-ga-id="zkaccount-payment-link">
          Get payment link
        </OptionButton>
      )}
      <QRCodeReader onResult={initGiftCard}>
        <OptionButton data-ga-id="zkaccount-gift-card">Redeem gift card</OptionButton>
      </QRCodeReader>
      <OptionButton onClick={() => setShowSettings(true)} data-ga-id="zkaccount-settings">
        Settings
      </OptionButton>
      <OptionButton onClick={() => handleOptionClick(logout)} data-ga-id="zkaccount-logout">
        Log out
      </OptionButton>
    </Container>
  );
};

export default ({ children }) => {
  const {
    balance: poolBalance, generateAddress, isDemo,
    isLoadingState, initializeGiftCard, getSeed,
  } = useContext(ZkAccountContext);
  const {
    openSeedPhraseModal, openAccountSetUpModal, openChangePasswordModal,
    openConfirmLogoutModal, openDisablePasswordModal, openPaymentLinkModal,
    isZkAccountDropdownOpen, openZkAccountDropdown, closeZkAccountDropdown,
  } = useContext(ModalContext);
  const { currentPool } = useContext(PoolContext);
  return (
    <Dropdown
      disabled={isLoadingState}
      isOpen={isZkAccountDropdownOpen}
      open={openZkAccountDropdown}
      close={closeZkAccountDropdown}
      content={() => (
        <Content
          balance={poolBalance}
          generateAddress={generateAddress}
          switchAccount={openAccountSetUpModal}
          setPassword={openChangePasswordModal}
          removePassword={openDisablePasswordModal}
          logout={openConfirmLogoutModal}
          showSeedPhrase={openSeedPhraseModal}
          isDemo={isDemo}
          isLoadingState={isLoadingState}
          initializeGiftCard={initializeGiftCard}
          getSeed={getSeed}
          currentPool={currentPool}
          close={closeZkAccountDropdown}
          generatePaymentLink={openPaymentLinkModal}
        />
      )}
    >
      {children}
    </Dropdown>
  );
};

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
  @media only screen and (max-width: 560px) {
    top: 11px;
  }
`;

const Title = styled.span`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
`;
