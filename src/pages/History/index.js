import React, { useContext } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import Card from 'components/Card';
// import Input from 'components/Input';
import Link from 'components/Link';
import ButtonDefaut from 'components/Button';
import Spinner from 'components/Spinner';

import { ZkAccountContext } from 'contexts';

import { shortAddress } from 'utils';

import { ReactComponent as SpinnerIconDefault } from 'assets/spinner.svg';
import depositIcon from 'assets/deposit.svg';
import withdrawIcon from 'assets/withdraw.svg';
import transferIcon from 'assets/transfer.svg';
import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

const actions = {
  1: {
    name: 'Deposit',
    icon: depositIcon,
  },
  2: {
    name: 'Transfer',
    icon: transferIcon,
  },
  3: {
    name: 'Transfer',
    icon: transferIcon,
  },
  4: {
    name: 'Withdrawal',
    icon: withdrawIcon,
  },
};

export default () => {
  const { history, zkAccount, isLoadingZkAccount, isLoadingHistory } = useContext(ZkAccountContext);
  return (
    <Card title="History">
      {/* <Input placeholder="Search..." /> */}
      {(isLoadingZkAccount || isLoadingHistory) && (
        <Spinner size={60} />
      )}
      {((!isLoadingZkAccount && !isLoadingHistory) && ((!history && !zkAccount) || history?.length === 0)) && (
        <span>No history yet.</span>
      )}
      {history?.length > 0 && history.map((item, index) =>
        <Row key={index}>
          <Section>
            <ActionLabel>
              <ActionIcon src={actions[item.type].icon} />
              <ActionName>{actions[item.type].name}</ActionName>
            </ActionLabel>
          </Section>
          <Section>
            <TokenIcon src={item.type === 1 ? daiIcon : zpDaiIcon} />
            <Amount>{[1, 2].includes(item.type) ? '+' : '-'}{ethers.utils.formatUnits(item.amount, 9)} {item.type === 1 ? 'DAI' : 'shDAI'}</Amount>
          </Section>
          <Section>
            <Link size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', item.txHash)}>
              {shortAddress(item.txHash)}
            </Link>
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
  border: 1px solid ${({ theme }) => theme.input.border.color.default};
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
