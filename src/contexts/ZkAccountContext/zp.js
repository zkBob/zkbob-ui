import { ethers, Contract } from 'ethers';
import wasmPath from 'libzkbob-rs-wasm-web/libzkbob_rs_wasm_bg.wasm';
import workerPath from 'zeropool-client-js/lib/worker.js?asset';
import { init as initZeroPool, ZeropoolClient } from 'zeropool-client-js';
import { deriveSpendingKey } from 'zeropool-client-js/lib/utils';
import { EvmNetwork } from 'zeropool-client-js/lib/networks/evm';

import { TX_STATUSES } from 'constants';
import { createPermitSignature } from 'utils/token';

import transferParamsUrl from 'assets/zp-params/transfer_params.bin';
import treeParamsUrl from 'assets/zp-params/tree_update_params.bin';
import transferVkUrl from 'assets/zp-params/transfer_verification_key.json?asset';
import treeVkUrl from 'assets/zp-params/tree_update_verification_key.json?asset';

const { parseEther } = ethers.utils;

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
  const ctx = await initZeroPool(wasmPath, workerPath, snarkParams);
  const tokens = {
    [TOKEN_ADDRESS]: {
      poolAddress: POOL_ADDRESS,
      relayerUrl: RELAYER_URL,
    }
  };
  return ZeropoolClient.create({
    sk,
    tokens,
    snarkParams: ctx.snarkParams,
    worker: ctx.worker,
    networkName: network,
    network: new EvmNetwork(RPC_URL),
  });
};

const deposit = async (signer, account, amount, setTxStatus) => {
  setTxStatus(TX_STATUSES.APPROVE_TOKENS);
  const tokenABI = [
    'function name() view returns (string)',
    'function nonces(address) view returns (uint256)',
  ];
  const token = new Contract(TOKEN_ADDRESS, tokenABI, signer);
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const signFunction = (deadline, value) => {
    setTxStatus(TX_STATUSES.SIGN_MESSAGE);
    return createPermitSignature(token, signer, POOL_ADDRESS, value, deadline);
  };
  const myAddress = await signer.getAddress();
  const jobId = await account.depositPermittable(TOKEN_ADDRESS, parseEther(amount), signFunction, myAddress, '0');
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  setTxStatus(TX_STATUSES.DEPOSITED);
};

const transfer = async (account, to, amount, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobId = await account.transfer(TOKEN_ADDRESS, [{ to, amount: parseEther(amount) }]);
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  setTxStatus(TX_STATUSES.TRANSFERRED);
};

const withdraw = async (account, to, amount, setTxStatus) => {
  setTxStatus(TX_STATUSES.GENERATING_PROOF);
  const jobId = await account.withdraw(TOKEN_ADDRESS, to, parseEther(amount));
  setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  setTxStatus(TX_STATUSES.WITHDRAWN);
};

export default { createAccount, deposit, transfer, withdraw };
