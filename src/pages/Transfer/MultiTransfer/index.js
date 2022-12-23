import React, { useState, useCallback, useContext, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { TxType } from 'zkbob-client-js';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/react';

import AccountSetUpButton from 'containers/AccountSetUpButton';
import MultitransferDetailsModal from 'components/MultitransferDetailsModal';

import Button from 'components/Button';
import TextEditor from 'components/TextEditor';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { ReactComponent as CrossIcon } from 'assets/red-cross.svg';

import { ZkAccountContext } from 'contexts';

import { formatNumber } from 'utils';
import { tokenSymbol } from 'utils/token';

export default forwardRef((props, ref) => {
  const {
    zkAccount, isLoadingState, transferMulti,
    estimateFee, verifyShieldedAddress,
  } = useContext(ZkAccountContext);
  const [data, setData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [fee, setFee] = useState(ethers.constants.Zero);
  const [numberOfTxs, setNumberOfTxs] = useState(ethers.constants.Zero);
  const [totalAmount, setTotalAmount] = useState(ethers.constants.Zero);

  const validate = useCallback(async () => {
    try {
      setParsedData([]);
      setErrorType(null);
      let errors = [];
      const rows = data.split('\n');
      const parsedData = await Promise.all(rows.map(async (row, index) => {
        try {
          const rowData = row.replace(/\s/g, '').split(',');
          const [address, amount] = rowData;
          if (!address || !amount || rowData.length !== 2) throw Error;

          const isValidAddress = await verifyShieldedAddress(address);
          if (!isValidAddress || !(Number(amount) > 0)) throw Error;

          return { address, amount: ethers.utils.parseEther(amount) };
        } catch (err) {
          errors.push(index);
          return null;
        }
      }));
      setErrors(errors);
      if (errors.length > 0) {
        setErrorType('syntax');
        return;
      }

      const dupes = {};
      parsedData.forEach((item, index) => {
        dupes[item.address] = dupes[item.address] || [];
        dupes[item.address].push(index);
      });
      const dupeLines = Object.values(dupes).reduce((acc, curr) => curr.length > 1 ? acc.concat(curr) : acc, []);
      setErrors(dupeLines);
      if (dupeLines.length > 0) {
        setErrorType('duplicates');
        return;
      }

      const { fee, numberOfTxs, insufficientFunds } = await estimateFee(parsedData.map(item => item.amount), TxType.Transfer);
      setFee(fee);
      setNumberOfTxs(numberOfTxs);
      setTotalAmount(parsedData.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero));
      if (insufficientFunds) {
        setErrorType('insufficient_funds');
        return;
      }

      setParsedData(parsedData);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'MultiTransfer.validate' } });
    }
  }, [data, estimateFee, verifyShieldedAddress]);

  useImperativeHandle(ref, () => ({
    handleFileUpload(event) {
      try {
        const reader = new FileReader();
        reader.onload = function() {
          setData(reader.result.replace(/\n+$/, ''));
          event.target.value = null;
        }
        reader.readAsText(event.target.files[0]);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'MultiTransfer.handleFileUpload' } });
      }
    }
  }));

  const onTransfer = useCallback(() => {
    setIsConfirmModalOpen(false);
    setData('');
    transferMulti(parsedData);
  }, [parsedData, transferMulti]);

  const openDetailsModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setIsDetailsModalOpen(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsConfirmModalOpen(true);
    setIsDetailsModalOpen(false);
  }, []);

  return (
    <>
      <Text>Add zkAddress, Amount of BOB to transfer. 1 address per line.</Text>
      <TextEditor
        value={data}
        onChange={setData}
        placeholder="M7dg2KkZuuSK8CU7N5pLMyuSCc1RoagsRWhH5yux1thVyUk57mpYrT2k6jh21cB, 100.75"
        errorLines={errors}
        error={errorType}
      />
      {!!errorType &&
        <ErrorRow>
          <CrossIcon />
          <Error>
            {(() => {
              if (errorType === 'syntax') {
                return `${errors.length} rows with incorrect addresses or formatting issues.`;
              } else if (errorType === 'duplicates') {
                return 'Duplicate addresses found.'
              } else if (errorType === 'insufficient_funds') {
                return `
                  Insufficient balance: ${formatNumber(totalAmount.add(fee), 9)} ${tokenSymbol()}
                  (${formatNumber(fee)} fee) is required.
                `;
              }
            })()}
          </Error>
        </ErrorRow>
      }
      {(() => {
          if (!zkAccount) return <AccountSetUpButton />
          else if (isLoadingState) return <Button $loading $contrast disabled>Updating zero pool state...</Button>
          else if (!data) return <Button disabled>Proceed</Button>
          else return <Button onClick={validate}>Proceed</Button>;
        })()}
        <ConfirmTransactionModal
          title="Multitransfer confirmation"
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={onTransfer}
          isMultitransfer={true}
          transfers={parsedData}
          openDetails={openDetailsModal}
          fee={fee}
          numberOfTxs={numberOfTxs}
          type="transfer"
        />
        <MultitransferDetailsModal
          title="Multitransfer"
          isOpen={isDetailsModalOpen}
          onBack={closeDetailsModal}
          transfers={parsedData}
        />
    </>
  );
});

const Text = styled.span`
  font-size: 14px;
  color: ${props => props.theme.card.note.color};
  font-weight: ${props => props.theme.text.weight.normal};
  padding: 0 10px;
  margin-top: 10px;
`;

const Error = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.error};
  font-weight: ${props => props.theme.text.weight.normal};
  margin-left: 7px;
`;

const ErrorRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
`;
