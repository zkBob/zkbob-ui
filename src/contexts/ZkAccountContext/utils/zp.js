import { ethers, Contract } from 'ethers';
import wasmPath from 'libzeropool-rs-wasm-web/libzeropool_rs_wasm_bg.wasm';
import workerPath from 'zeropool-client-js/lib/worker.js?asset';
import { init as initZeroPool, ZeropoolClient } from 'zeropool-client-js';
import { EvmNetwork } from 'zeropool-client-js/lib/networks/evm';

import transferParamsUrl from 'assets/zp-params/transfer_params.bin';
import treeParamsUrl from 'assets/zp-params/tree_update_params.bin';
import transferVkUrl from 'assets/zp-params/transfer_verification_key.json?asset';
import treeVkUrl from 'assets/zp-params/tree_update_verification_key.json?asset';

const { parseEther } = ethers.utils;

const POOL_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

const snarkParams = {
  transferParamsUrl,
  treeParamsUrl,
  transferVkUrl,
  treeVkUrl,
};

async function createAccount(privateKey) {
  const sk = Uint8Array.from(privateKey.split('').slice(2, 34));
  const ctx = await initZeroPool(wasmPath, workerPath, snarkParams);
  const tokens = {
    [TOKEN_ADDRESS]: {
      poolAddress: POOL_ADDRESS,
      relayerUrl: 'https://relayer.thgkjlr.website/',
    }
  };
  return ZeropoolClient.create({
    sk,
    tokens,
    snarkParams: ctx.snarkParams,
    worker: ctx.worker,
    networkName: 'xdai',
    network: new EvmNetwork('https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
  });
}

async function deposit(signer, account, amount) {
  console.log('Making a deposit...');
  const tokenABI = ['function approve(address,uint256)'];
  const token = new Contract(TOKEN_ADDRESS, tokenABI, signer);
  await token.approve(POOL_ADDRESS, parseEther(amount));
  const signFunction = (data) => signer.signMessage(ethers.utils.arrayify(data));
  const jobId = await account.deposit(TOKEN_ADDRESS, parseEther(amount), signFunction);
  console.log('Please wait relayer complete the job %s...', jobId);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  console.log('Deposited!');
}

async function transfer(account, to, amount) {
  console.log('Making a transfer...');
  const jobId = await account.transfer(TOKEN_ADDRESS, [{ to, amount: parseEther(amount) }]);
  console.log('Please wait relayer complete the job %s...', jobId);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  console.log('Transfered!');
}

async function withdraw(account, to, amount) {
  console.log('Making a withdrawal...');
  const jobId = await account.withdraw(TOKEN_ADDRESS, to, parseEther(amount));
  console.log('Please wait relayer complete the job %s...', jobId);
  await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
  console.log('Withdrawn!');
}

export default { createAccount, deposit, withdraw, transfer };
