import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';

import Layout from 'components/Layout';
import Card from 'components/Card';
import Button from 'components/Button';
import Limits from 'components/Limits';
import Tooltip from 'components/Tooltip';
import TokenListModal from 'components/TokenListModal';
import Skeleton from 'components/Skeleton';

import WalletModal from 'containers/WalletModal';

import Header from './Header';
import Input from './Input';
import PseudoInput from './PseudoInput';

import { ReactComponent as TryZkBobBannerImageDefault } from 'assets/try-zkbob-banner.svg';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import ModalContext from 'contexts/ModalContext';

import config from 'config';

import { formatNumber } from 'utils';

import { useTokenList, useTokenAmount, useLimitsAndFees } from './hooks';

const pools = Object.values(config.pools).map((pool, index) =>
  ({ ...pool, alias: Object.keys(config.pools)[index] })
);

export default () => {
  const history = useHistory();
  const params = useParams();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);

  const addressPrefix = params.address.split(':')[0];
  const pool = Object.values(pools).find(pool => pool.addressPrefix === addressPrefix);
  if (!pool.paymentContractAddress) {
    history.push('/');
  }

  const { limit, isLoadingLimit, fee, isLoadingFee } = useLimitsAndFees(pool);

  const tokenAmount = useTokenAmount(pool, selectedToken?.address, amount);

  const { isTokenListModalOpen, openTokenListModal, closeTokenListModal } = useContext(ModalContext);
  const tokenList = useTokenList(pool.chainId);

  useEffect(() => {
    if (tokenList.length) {
      const defaultToken = tokenList.find(token => token.tags.includes('native'));
      setSelectedToken(defaultToken);
    }
  }, [tokenList]);

  return (
    <>
      <Layout header={<Header />}>
        <Title>Enter USD value and choose a token</Title>
        <Card>
          <InputLabel>The amount you'd like to send</InputLabel>
          <Input placeholder={0} value={amount} onChange={setAmount} />
          <InputLabel>Transfer amount</InputLabel>
          <PseudoInput
            value={tokenAmount}
            token={selectedToken}
            onSelect={openTokenListModal}
          />
          <RowSpaceBetween>
            <Text>The recipient will get payment in {pool.tokenSymbol}</Text>
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
          <Button>Send</Button>
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
    </>
  );
}

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

const InfoIcon = styled(InfoIconDefault)`
  margin-left: 5px;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
