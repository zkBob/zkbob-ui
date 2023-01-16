import { Contract } from 'ethers';
import { init as initZkBob, ZkBobClient } from 'zkbob-client-js';
import { deriveSpendingKeyZkBob } from 'zkbob-client-js/lib/utils';
import { ProverMode } from 'zkbob-client-js/lib/config';
import { EvmNetwork } from 'zkbob-client-js/lib/networks/evm';

import { TX_STATUSES } from 'constants';
import { createPermitSignature } from 'utils/token';

const POOL_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;
const RELAYER_URL = process.env.REACT_APP_RELAYER_URL;
const RPC_URL = process.env.REACT_APP_RPC_URL;
const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

const snarkParams = {
  transferParamsUrl: `${BUCKET_URL}/transfer_params.bin`,
  treeParamsUrl: `${BUCKET_URL}/tree_params.bin`,
  transferVkUrl: `${BUCKET_URL}/transfer_verification_key.json`,
  treeVkUrl: `${BUCKET_URL}/tree_verification_key.json`,
};

const createAccount = async (mnemonic, statusCallback, isNewAccount = false, supportId) => {
  const network = process.env.REACT_APP_ZEROPOOL_NETWORK;
  const sk = deriveSpendingKeyZkBob(mnemonic, network);
  const ctx = await initZkBob(snarkParams, RELAYER_URL, statusCallback);
  const tokens = {
    [TOKEN_ADDRESS]: {
      poolAddress: POOL_ADDRESS,
      relayerUrl: RELAYER_URL,
      coldStorageConfigPath: `${BUCKET_URL}/coldstorage/coldstorage.cfg`,
      birthindex: isNewAccount ? -1 : undefined,
      proverMode: ProverMode.Local,
    }
  };
  return ZkBobClient.create({
    sk,
    tokens,
    worker: ctx.worker,
    networkName: network,
    network: new EvmNetwork(RPC_URL),
    supportId,
  });
};

const deposit = async (signer, account, amount, fee, setTxStatus) => {
  const tokenABI = [
    'function name() view returns (string)',
    'function nonces(address) view returns (uint256)',
  ];
  const token = new Contract(TOKEN_ADDRESS, tokenABI, signer);
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const signFunction = async (deadline, value, salt) => {
    setTxStatus(TX_STATUSES.SIGN_MESSAGE);
    const signature = await createPermitSignature(token, signer, POOL_ADDRESS, value, deadline, salt);
    setTxStatus(TX_STATUSES.GENERATING_PROOF);
    return signature;
  };
  const myAddress = await signer.getAddress();
  const jobId = await account.depositPermittable(TOKEN_ADDRESS, amount, signFunction, myAddress, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobTxHash(TOKEN_ADDRESS, jobId);
  setTxStatus(TX_STATUSES.DEPOSITED);
};

const transfer = async (account, transfers, fee, setTxStatus, isMulti) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobIds = await account.transferMulti(TOKEN_ADDRESS, transfers, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobsTxHashes(TOKEN_ADDRESS, jobIds);
  setTxStatus(TX_STATUSES[isMulti ? 'TRANSFERRED_MULTI' : 'TRANSFERRED']);
};

const withdraw = async (account, to, amount, fee, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobIds = await account.withdrawMulti(TOKEN_ADDRESS, to, amount, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobsTxHashes(TOKEN_ADDRESS, jobIds);
  setTxStatus(TX_STATUSES.WITHDRAWN);
};

const zp = { createAccount, deposit, transfer, withdraw };
export default zp;
