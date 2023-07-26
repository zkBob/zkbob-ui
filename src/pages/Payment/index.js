import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

import Layout from 'components/Layout';
import Card from 'components/Card';
import Button from 'components/Button';
import Limits from 'components/Limits';
import Tooltip from 'components/Tooltip';

import WalletModal from 'containers/WalletModal';

import Header from './Header';
import Input from './Input';
import PseudoInput from './PseudoInput';

import { ReactComponent as TryZkBobBannerImageDefault } from 'assets/try-zkbob-banner.svg';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

export default () => {
  const history = useHistory();
  const [amount, setAmount] = useState('');
  return (
    <>
      <Layout header={<Header />}>
        <Title>Enter USD value and choose a token</Title>
        <Card>
          <InputLabel>The amount you'd like to send</InputLabel>
          <Input placeholder={0} value={amount} onChange={setAmount} />
          <InputLabel>Transfer amount</InputLabel>
          <PseudoInput value={amount * 0.0005} tokenSymbol="ETH" />
          <RowSpaceBetween>
            <Text>The recipient will get payment in ETH</Text>
            <Row>
              <Text>Fees: 1.4 USD</Text>
              <Tooltip
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
              </Tooltip>
            </Row>
          </RowSpaceBetween>
          <Button>Send</Button>
        </Card>
        <Limits
          loading={false}
          limits={[{
            prefix: 'The maximum amount',
            suffix: 'to be paid from one address',
            value: ethers.utils.parseUnits('10000', 18),
          }]}
          currentPool={{ tokenSymbol: 'USD', tokenDecimals: 18 }}
        />
        <TryZkBobBannerImage onClick={() => history.push('/')} />
      </Layout>
      <WalletModal />
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
