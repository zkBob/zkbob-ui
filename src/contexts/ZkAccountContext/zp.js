import { Contract, ethers } from 'ethers';
import { ZkBobClient } from 'zkbob-client-js';
import { deriveSpendingKeyZkBob } from 'zkbob-client-js/lib/utils';
import { ProverMode } from 'zkbob-client-js/lib/config';

import { TX_STATUSES } from 'constants';
import { createPermitSignature } from 'utils/token';
import config from 'config';

const createClient = (currentPoolAlias, supportId) => {
  return ZkBobClient.create({
    pools: config.pools,
    chains: config.chains,
    snarkParams: config.snarkParams,
    supportId,
  }, currentPoolAlias);
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
  const tokenABI = [
    'function name() view returns (string)',
    'function nonces(address) view returns (uint256)',
  ];
  const currentPoolAlias = zkClient.currentPool();
  const { tokenAddress, poolAddress } = config.pools[currentPoolAlias]
  const token = new Contract(tokenAddress, tokenABI, signer);
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const signFunction = async (deadline, value, salt) => {
    setTxStatus(TX_STATUSES.SIGN_MESSAGE);
    const signature = await createPermitSignature(token, signer, poolAddress, value, deadline, salt);
    setTxStatus(TX_STATUSES.GENERATING_PROOF);
    return signature;
  };
  const myAddress = await signer.getAddress();
  const jobId = await zkClient.deposit(amount, signFunction, myAddress, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await zkClient.waitJobTxHash(jobId);
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

const zp = { createClient, createAccount, deposit, transfer, withdraw };
export default zp;
