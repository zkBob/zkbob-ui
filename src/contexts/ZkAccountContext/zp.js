import { ethers } from 'ethers';
import { ZkBobClient, SignatureType, DirectDepositType } from 'zkbob-client-js';
import { deriveSpendingKeyZkBob } from 'zkbob-client-js/lib/utils';
import { ProverMode } from 'zkbob-client-js/lib/config';

import { TX_STATUSES } from 'constants';
import config from 'config';

const createClient = (currentPoolAlias, supportId, callback) => {
  return ZkBobClient.create(
    {
      pools: config.pools,
      chains: config.chains,
      snarkParams: config.snarkParams,
      supportId,
    },
    currentPoolAlias,
    callback,
  );
};

const createAccount = async (zkClient, secretKey, birthIndex, useDelegatedProver) => {
  let sk = ethers.utils.isValidMnemonic(secretKey)
    ? deriveSpendingKeyZkBob(secretKey)
    : ethers.utils.arrayify(secretKey);
  const currentPoolAlias = zkClient.currentPool();
  const proverExists = config.pools[currentPoolAlias].delegatedProverUrls.length > 0;
  return zkClient.login({
    sk,
    pool: currentPoolAlias,
    birthindex: birthIndex,
    proverMode: (useDelegatedProver && proverExists) ? ProverMode.DelegatedWithFallback : ProverMode.Local,
  });
};

const deposit = async (signer, zkClient, amount, fee, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const signFunction = async ({ type, data }) => {
    setTxStatus(TX_STATUSES.SIGN_MESSAGE);
    let signature;
    if (type === SignatureType.TypedDataV4) {
      const { domain, types, message } = data;
      delete types.EIP712Domain;
      signature = await signer._signTypedData(domain, types, message);
    }
    setTxStatus(TX_STATUSES.GENERATING_PROOF);
    return signature;
  };
  const myAddress = await signer.getAddress();
  const jobId = await zkClient.deposit(amount, signFunction, myAddress, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await zkClient.waitJobTxHash(jobId);
  setTxStatus(TX_STATUSES.DEPOSITED);
};

const directDeposit = async (signer, zkClient, amount, setTxStatus) => {
  setTxStatus(TX_STATUSES.CONFIRM_TRANSACTION);
  const sendFunction = async ({ to, amount, data }) => {
    const tx = await signer.sendTransaction({ to, value: amount, data });
    setTxStatus(TX_STATUSES.WAITING_FOR_TRANSACTION);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  };
  const myAddress = await signer.getAddress();
  await zkClient.directDeposit(DirectDepositType.Native, myAddress, amount, sendFunction);
  setTxStatus(TX_STATUSES.DEPOSITED);
};

const transfer = async (zkClient, transfers, fee, setTxStatus, isMulti) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobIds = await zkClient.transferMulti(transfers, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await zkClient.waitJobsTxHashes(jobIds);
  setTxStatus(TX_STATUSES[isMulti ? 'TRANSFERRED_MULTI' : 'TRANSFERRED']);
};

const withdraw = async (zkClient, to, amount, amountToConvert, fee, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobIds = await zkClient.withdrawMulti(to, amount, amountToConvert, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await zkClient.waitJobsTxHashes(jobIds);
  setTxStatus(TX_STATUSES.WITHDRAWN);
};

const zp = { createClient, createAccount, deposit, directDeposit, transfer, withdraw };
export default zp;
