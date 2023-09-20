import React, { useState, useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useTranslation, Trans } from 'react-i18next';

import Layout from 'components/Layout';
import Card from 'components/Card';
import Button from 'components/Button';
import Limits from 'components/Limits';
// import Tooltip from 'components/Tooltip';
import TokenListModal from 'components/TokenListModal';
import Skeleton from 'components/Skeleton';
import TransactionModal from 'components/TransactionModal';

import WalletModal from 'containers/WalletModal';

import Header from './Header';
import Input from './Input';
import PseudoInput from './PseudoInput';
import ConfirmationModal from './ConfirmationModal';

import { ReactComponent as TryZkBobBannerImageDefault } from 'assets/try-zkbob-banner.svg';
// import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';
import SupportIdContext, { SupportIdContextProvider } from 'contexts/SupportIdContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';
import { LanguageContextProvider } from 'contexts/LanguageContext';

import config from 'config';

import { formatNumber } from 'utils';
import { useApproval } from 'hooks';
import { useTokensWithBalances, useTokenAmount, useLimitsAndFees, usePayment } from './hooks';
import { getPermitType } from './utils';

const pools = Object.values(config.pools).map((pool, index) =>
  ({ ...pool, alias: Object.keys(config.pools)[index] })
);

const Payment = () => {
  const { t } = useTranslation();
  const { supportId } = useContext(SupportIdContext);
  const history = useHistory();
  const params = useParams();
  const addressPrefix = params.address.split(':')[0];
  const pool = Object.values(pools).find(pool => pool.addressPrefix === addressPrefix);
  if (!pool.paymentContractAddress) {
    history.push('/');
  }

  const { address: account } = useAccount();
  const [displayedAmount, setDisplayedAmount] = useState('');
  const amount = useMemo(() => ethers.utils.parseUnits(displayedAmount || '0', pool?.tokenDecimals), [displayedAmount, pool]);
  const [selectedToken, setSelectedToken] = useState(null);

  const { limit, isLoadingLimit, fee, isLoadingFee } = useLimitsAndFees(pool);
  const { tokenAmount, liFiRoute, isTokenAmountLoading } = useTokenAmount(pool, selectedToken?.address, amount, fee);
  const { isApproved, approve } = useApproval(pool?.chainId, selectedToken?.address, tokenAmount);
  const permitType = useMemo(() => getPermitType(selectedToken, pool?.chainId), [pool, selectedToken]);
  const { send } = usePayment(selectedToken, tokenAmount, amount, fee, pool, params.address, liFiRoute);

  const { txStatus, isTxModalOpen, closeTxModal, txAmount, txHash, txError } = useContext(TransactionModalContext);
  const {
    isTokenListModalOpen, openTokenListModal,
    closeTokenListModal, openWalletModal,
    openPaymentConfirmationModal, closePaymentConfirmationModal,
  } = useContext(ModalContext);
  const { tokens, isLoadingBalances } = useTokensWithBalances(pool);

  useEffect(() => {
    if (tokens.length) {
      const defaultToken =
        tokens.find(token => token.symbol === pool.tokenSymbol) ||
        tokens.find(token => token.address === ethers.constants.AddressZero);
      setSelectedToken(defaultToken);
    }
  }, [tokens, pool]);

  const onSend = () => {
    setDisplayedAmount('');
    send();
    closePaymentConfirmationModal();
  };

  return (
    <>
      <Layout header={<Header />}>
        <Title>{t('payment.title')}</Title>
        <Card>
          <InputLabel>{t('payment.amountToSend')}</InputLabel>
          <Input placeholder={0} value={displayedAmount} onChange={setDisplayedAmount} />
          <InputLabel>{t('payment.transferAmount')}</InputLabel>
          <PseudoInput
            value={tokenAmount}
            token={selectedToken}
            onSelect={openTokenListModal}
            isLoading={isTokenAmountLoading}
            isLoadingBalances={isLoadingBalances}
          />
          <RowSpaceBetween>
            <Text style={{ marginRight: 20 }}>
              {t('payment.recipientReceives', { symbol: pool.tokenSymbol })}
            </Text>
            <Row>
              <Text style={{ marginRight: 4 }}>{t('common.fee')}:</Text>
              {isLoadingFee
                ? <Skeleton width={40} />
                : <Text>{formatNumber(fee, pool.tokenDecimals)} USD</Text>
              }
              {/* <Tooltip
                content={
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Deposit fee: 0.2 USD</span>
                    <span>Convert fee: 0.8 USD</span>
                    <span>Fee: 0.4 USD</span>
                  </div>
                }
                placement="right"
                delay={0}
              >
                <InfoIcon />
              </Tooltip> */}
            </Row>
          </RowSpaceBetween>
          {(() => {
            if (!account)
              return <Button onClick={openWalletModal}>{t('buttonText.connectWallet')}</Button>
            else if (tokenAmount.isZero())
              return <Button disabled>{t('buttonText.enterAmount')}</Button>
            else if (tokenAmount.gt(selectedToken?.balance || ethers.constants.Zero))
              return <Button disabled>{t('buttonText.insufficientBalance', { symbol: selectedToken?.symbol })}</Button>
            else if (amount.gt(limit))
              return <Button disabled>{t('buttonText.amountExceedsLimit')}</Button>
            else if (selectedToken?.address !== ethers.constants.AddressZero && permitType === 'permit2' && !isApproved)
              return <Button onClick={approve}>{t('buttonText.approveTokens')}</Button>
            else
              return <Button onClick={openPaymentConfirmationModal}>{t('buttonText.send')}</Button>;
          })()}
        </Card>
        <Limits
          loading={isLoadingLimit}
          limits={[{
            name: <Trans i18nKey="payment.limit" />,
            value: limit,
          }]}
          currentPool={{ ...pool, tokenSymbol: 'USD' }}
        />
        <TryZkBobBannerImage onClick={() => history.push('/')} />
      </Layout>
      <WalletModal />
      <TokenListModal
        isOpen={isTokenListModalOpen}
        onClose={closeTokenListModal}
        tokens={tokens}
        isLoadingBalances={isLoadingBalances}
        onSelect={token => {
          setSelectedToken(token);
          closeTokenListModal();
        }}
      />
      <ConfirmationModal
        onConfirm={onSend}
        amount={displayedAmount}
        symbol={'USD'}
        tokenAmount={tokenAmount}
        token={selectedToken}
        receiver={params.address}
        sender={account}
        fee={formatNumber(fee, pool?.tokenDecimals)}
      />
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={closeTxModal}
        status={txStatus}
        amount={txAmount}
        error={txError}
        supportId={supportId}
        currentPool={pool}
        txHash={txHash}
      />
    </>
  );
}

export default () => (
  <SupportIdContextProvider>
    <TransactionModalContextProvider>
      <ModalContextProvider>
        <LanguageContextProvider>
          <Payment />
        </LanguageContextProvider>
      </ModalContextProvider>
    </TransactionModalContextProvider>
  </SupportIdContextProvider>
);

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  padding: 0 12px;
  flex-wrap: wrap;
`;

const InputLabel = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  padding: 0 12px;
  margin-bottom: 8px;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
`;

const Title = styled.span`
  font-size: 24px;
  line-height: 32px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  margin-bottom: 24px;
  @media only screen and (max-width: 560px) {
    display: none;
  }
`;

const TryZkBobBannerImage = styled(TryZkBobBannerImageDefault)`
  max-width: 100%;
  margin-top: 20px;
  cursor: pointer;
`;

// const InfoIcon = styled(InfoIconDefault)`
//   margin-left: 5px;
//   &:hover {
//     & > path {
//       fill: ${props => props.theme.color.purple};
//     }
//   }
// `;
