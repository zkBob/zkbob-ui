import { Contract } from 'ethers';
import wasmPath from 'libzkbob-rs-wasm-web/libzkbob_rs_wasm_bg.wasm';
import workerPath from 'zkbob-client-js/lib/worker.js?asset';
import { init as initZkBob, ZkBobClient } from 'zkbob-client-js';
import { deriveSpendingKey } from 'zkbob-client-js/lib/utils';
import { EvmNetwork } from 'zkbob-client-js/lib/networks/evm';

import { TX_STATUSES } from 'constants';
import { createPermitSignature } from 'utils/token';

import transferParamsUrl from 'assets/zp-params/transfer_params.bin';
import treeParamsUrl from 'assets/zp-params/tree_params.bin';
import transferVkUrl from 'assets/zp-params/transfer_verification_key.json?asset';
import treeVkUrl from 'assets/zp-params/tree_verification_key.json?asset';

const POOL_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;
const RELAYER_URL = process.env.REACT_APP_RELAYER_URL;
const RPC_URL = process.env.REACT_APP_RPC_URL;

const snarkParams = {
  transferParamsUrl,
  treeParamsUrl,
  transferVkUrl,
  treeVkUrl,
};

const createAccount = async mnemonic => {
  const network = process.env.REACT_APP_ZEROPOOL_NETWORK;
  const sk = deriveSpendingKey(mnemonic, network);
  const ctx = await initZkBob(wasmPath, workerPath, snarkParams);
  const tokens = {
    [TOKEN_ADDRESS]: {
      poolAddress: POOL_ADDRESS,
      relayerUrl: RELAYER_URL,
    }
  };
  return ZkBobClient.create({
    sk,
    tokens,
    snarkParams: ctx.snarkParams,
    worker: ctx.worker,
    networkName: network,
    network: new EvmNetwork(RPC_URL),
  });
};

const deposit = async (signer, account, amount, fee, setTxStatus) => {
  setTxStatus(TX_STATUSES.APPROVE_TOKENS);
  const tokenABI = [
    'function name() view returns (string)',
    'function nonces(address) view returns (uint256)',
  ];
  const token = new Contract(TOKEN_ADDRESS, tokenABI, signer);
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const signFunction = (deadline, value, salt) => {
    setTxStatus(TX_STATUSES.SIGN_MESSAGE);
    return createPermitSignature(token, signer, POOL_ADDRESS, value, deadline, salt);
  };
  const myAddress = await signer.getAddress();
  const jobId = await account.depositPermittableV2(TOKEN_ADDRESS, amount, signFunction, myAddress, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  setTxStatus(TX_STATUSES.DEPOSITED);
};

const transfer = async (account, to, amount, fee, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobIds = await account.transferMulti(TOKEN_ADDRESS, to, amount, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobsCompleted(TOKEN_ADDRESS, jobIds);
  setTxStatus(TX_STATUSES.TRANSFERRED);
};

const withdraw = async (account, to, amount, fee, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobIds = await account.withdrawMulti(TOKEN_ADDRESS, to, amount, fee);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobsCompleted(TOKEN_ADDRESS, jobIds);
  setTxStatus(TX_STATUSES.WITHDRAWN);
};

const zp = { createAccount, deposit, transfer, withdraw };
export default zp;
