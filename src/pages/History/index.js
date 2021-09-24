import React from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import Input from 'components/Input';
import ButtonDefaut from 'components/Button';

import depositIcon from 'assets/deposit.svg';
import withdrawIcon from 'assets/withdraw.svg';
import transferIcon from 'assets/transfer.svg';
import ethIcon from 'assets/eth.svg';
import zpEthIcon from 'assets/zp-eth.svg';

import data from './data.json';

const tokens = {
  eth: {
    icon: ethIcon,
    symbol: 'ETH',
  },
  shEth: {
    icon: zpEthIcon,
    symbol: 'shETH',
  },
};

const actions = {
  deposit: {
    name: 'Deposit',
    icon: depositIcon,
  },
  withdraw: {
    name: 'Withdraw',
    icon: withdrawIcon,
  },
  transfer: {
    name: 'Transfer',
    icon: transferIcon,
  },
};

export default () => {
  return (
    <Card title="History">
      <Input placeholder="Search..." />
      {data.map(item =>
        <Row>
          <Section>
            <ActionLabel>
              <ActionIcon src={actions[item.action].icon} />
              <ActionName>{actions[item.action].name}</ActionName>
            </ActionLabel>
          </Section>
          <Section>
            <TokenIcon src={tokens[item.token].icon} />
            <Amount>{item.amount} {tokens[item.token].symbol}</Amount>
          </Section>
          <Section>
            <Button type="link">{item.txHash}</Button>
          </Section>
        </Row>
      )}
    </Card>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  &:last-child {
    justify-content: flex-end;
  }
`;

const ActionLabel = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 10px;
  padding: 8px;
`;

const ActionIcon = styled.img`
  margin-right: 8px;
`;

const TokenIcon = styled.img`
  margin-right: 8px;
  width: 24px;
  height: 24px;
`;

const ActionName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const Amount = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const Button = styled(ButtonDefaut)`
  font-size: 16px;
`;
