import React, { useState, useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

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

import { ReactComponent as TryZkBobBannerImageDefault } from 'assets/try-zkbob-banner.svg';
// import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import ModalContext, { ModalContextProvider } from 'contexts/ModalContext';
import SupportIdContext, { SupportIdContextProvider } from 'contexts/SupportIdContext';
import TransactionModalContext, { TransactionModalContextProvider } from 'contexts/TransactionModalContext';

import config from 'config';

import { formatNumber } from 'utils';
import { useApproval } from 'hooks';
import { useTokenList, useTokenAmount, useLimitsAndFees, useTokenBalance, usePayment } from './hooks';
import { getPermitType } from './utils';

const pools = Object.values(config.pools).map((pool, index) =>
  ({ ...pool, alias: Object.keys(config.pools)[index] })
);

const Payment = () => {
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
  const { balance, isLoadingBalance } = useTokenBalance(pool?.chainId, selectedToken);
  const { tokenAmount, liFiRoute, isTokenAmountLoading } = useTokenAmount(pool, selectedToken?.address, amount, fee);
  const { isApproved, approve } = useApproval(pool?.chainId, selectedToken?.address, tokenAmount);
  const permitType = useMemo(() => getPermitType(selectedToken, pool?.chainId), [pool, selectedToken]);
  const { send } = usePayment(selectedToken, tokenAmount, amount, fee, pool, params.address, liFiRoute);

  const { txStatus, isTxModalOpen, closeTxModal, txAmount, txHash, txError } = useContext(TransactionModalContext);
  const { isTokenListModalOpen, openTokenListModal, closeTokenListModal, openWalletModal } = useContext(ModalContext);
  const tokenList = useTokenList(pool);

  useEffect(() => {
    if (tokenList.length) {
      const defaultToken =
        tokenList.find(token => token.symbol === pool.tokenSymbol) ||
        tokenList.find(token => token.tags.includes('native'));
      setSelectedToken(defaultToken);
    }
  }, [tokenList, pool]);

  const onSend = () => {
    setDisplayedAmount('');
    send();
  };

  return (
    <>
      <Layout header={<Header />}>
        <Title>Enter USD value and choose a token</Title>
        <Card>
          <InputLabel>The amount you'd like to send</InputLabel>
          <Input placeholder={0} value={displayedAmount} onChange={setDisplayedAmount} />
          <InputLabel>Transfer amount</InputLabel>
          <PseudoInput
            value={tokenAmount}
            token={selectedToken}
            onSelect={openTokenListModal}
            isLoading={isTokenAmountLoading}
            balance={balance}
            isLoadingBalance={isLoadingBalance}
          />
          <RowSpaceBetween>
            <Text style={{ marginRight: 20 }}>
              The recipient will get payment in {pool.tokenSymbol}
            </Text>
            <Row>
              <Text style={{ marginRight: 4 }}>Fee:</Text>
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
              return <Button onClick={openWalletModal}>Connect wallet</Button>
            else if (tokenAmount.isZero())
              return <Button disabled>Enter amount</Button>
            else if (tokenAmount.gt(balance))
              return <Button disabled>Insufficient {selectedToken?.symbol} balance</Button>
            else if (amount.gt(limit))
              return <Button disabled>Amount exceeds limit</Button>
            else if (!selectedToken?.tags.includes('native') && permitType === 'permit2' && !isApproved)
              return <Button onClick={approve}>Approve tokens</Button>
            else
              return <Button onClick={onSend}>Send</Button>;
          })()}
        </Card>
        <Limits
          loading={isLoadingLimit}
          limits={[{
            prefix: 'The maximum amount',
            suffix: 'to be paid from one address',
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
        tokens={tokenList}
        onSelect={token => {
          setSelectedToken(token);
          closeTokenListModal();
        }}
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
        <Payment />
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
