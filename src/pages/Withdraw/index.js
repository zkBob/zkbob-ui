import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { TxType } from 'zkbob-client-js';
import { HistoryTransactionType } from 'zkbob-client-js';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import PendingAction from 'containers/PendingAction';

import { ZkAccountContext } from 'contexts';

import TransferInput from 'components/TransferInput';
import Card from 'components/Card';
import Button from 'components/Button';
import MultilineInput from 'components/MultilineInput';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';
import LatestAction from 'components/LatestAction';
import Limits from 'components/Limits';
import Tooltip from 'components/Tooltip';
import DemoCard from 'components/DemoCard';

import { ReactComponent as InfoIconDefault } from 'assets/info.svg';
import { ReactComponent as BobIconDefault } from 'assets/bob.svg';

import { useFee, useParsedAmount, useLatestAction } from 'hooks';

import { tokenSymbol } from 'utils/token';
import { formatNumber, minBigNumber } from 'utils';

import { NETWORKS } from 'constants';
import { useMaxAmountExceeded } from './hooks';

const note = `${tokenSymbol()} will be withdrawn from the zero knowledge pool and deposited into the selected account.`;

export default () => {
  const {
    zkAccount, balance, withdraw, isLoadingState,
    isPending, maxTransferable, isDemo,
    limits, isLoadingLimits, minTxAmount,
  } = useContext(ZkAccountContext);
  const [displayAmount, setDisplayAmount] = useState('');
  const amount = useParsedAmount(displayAmount);
  const [receiver, setReceiver] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const latestAction = useLatestAction(HistoryTransactionType.Withdrawal);
  const { fee, numberOfTxs, isLoadingFee } = useFee(amount, TxType.Withdraw);
  const maxAmountExceeded = useMaxAmountExceeded(amount, maxTransferable, limits.dailyWithdrawalLimit?.available);

  const onWihdrawal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDisplayAmount('');
    setReceiver('');
    withdraw(receiver, amount);
  }, [receiver, amount, withdraw]);

  const setMax = useCallback(async () => {
    const max = minBigNumber(maxTransferable, limits.dailyWithdrawalLimit.available);
    setDisplayAmount(ethers.utils.formatEther(max));
  }, [maxTransferable, limits]);

  if (isDemo) return <DemoCard />;

  let button = null;
  if (zkAccount) {
    if (isLoadingState || isLoadingLimits) {
      button = <Button $loading $contrast disabled>Updating zero pool state...</Button>;
    } else if (amount.isZero()) {
      button = <Button disabled>Enter amount</Button>;
    } else if (amount.lt(minTxAmount)) {
      button = <Button disabled>Min amount is {formatNumber(minTxAmount)} {tokenSymbol()}</Button>
    } else if (amount.gt(balance)) {
      button = <Button disabled>Insufficient {tokenSymbol(true)} balance</Button>;
    } else if (amount.gt(maxTransferable)) {
      button = <Button disabled>Reduce amount to include {formatNumber(fee)} fee</Button>;
    } else if (amount.gt(limits.dailyWithdrawalLimit.available)) {
      button = <Button disabled>Amount exceeds daily limit</Button>;
    } else if (!receiver) {
      button = <Button disabled>Enter address</Button>;
    } else if (!ethers.utils.isAddress(receiver)) {
      button = <Button disabled>Invalid address</Button>;
    } else {
      button = <Button onClick={() => setIsConfirmModalOpen(true)}>Withdraw</Button>;
    }
  } else {
    button = <AccountSetUpButton />;
  }
  return isPending ? <PendingAction /> : (
    <>
      <Card title="Withdraw" note={note}>
        <TransferInput
          balance={zkAccount ? balance : null}
          isLoadingBalance={isLoadingState}
          amount={displayAmount}
          onChange={setDisplayAmount}
          shielded={true}
          fee={fee}
          setMax={setMax}
          maxAmountExceeded={maxAmountExceeded}
          isLoadingFee={isLoadingFee}
        />
        <MultilineInput
          placeholder={`Enter ${NETWORKS[process.env.REACT_APP_NETWORK].name} address of receiver`}
          secondary
          value={receiver}
          onChange={setReceiver}
        />
        {button}
        <MessageContainer>
          <Row>
            <Text>Withdraw at least</Text>
            <BobIcon />
            <Text style={{ marginRight: 4 }}><b>10 BOB</b></Text>
          </Row>
          <Row>
            <Text>and receive an additional <b>0.1 MATIC *</b></Text>
            <Tooltip
              content={<span>* only addresses with<br />a 0 MATIC balance receive additional MATIC</span>}
              placement="right"
              delay={0}
              width={180}
            >
              <InfoIcon />
            </Tooltip>
          </Row>
        </MessageContainer>
        <ConfirmTransactionModal
          title="Withdrawal confirmation"
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={onWihdrawal}
          amount={amount}
          receiver={receiver}
          shielded={true}
          fee={fee}
          numberOfTxs={numberOfTxs}
          type="withdrawal"
        />
      </Card>
      <Limits
        loading={isLoadingLimits}
        limits={[
          { prefix: "Daily withdrawal", suffix: "limit", value: limits.dailyWithdrawalLimit },
        ]}
      />
      {latestAction && (
        <LatestAction
          type="Withdrawal"
          shielded={true}
          actions={latestAction.actions}
          txHash={latestAction.txHash}
        />
      )}
    </>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const MessageContainer = styled(Row)`
  justify-content: center;
  flex-wrap: wrap;
  background: #FBEED0;
  border-radius: 10px;
  padding: 7px 10px;
`;

const Text = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text.color.secondary};
`;

const InfoIcon = styled(InfoIconDefault)`
  margin-left: 2px;
  margin-right: -2px;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;

const BobIcon = styled(BobIconDefault)`
  width: 20px;
  height: 20px;
  margin: 0 5px;
`;
