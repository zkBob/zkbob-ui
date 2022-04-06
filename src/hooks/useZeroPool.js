import { useCallback, useContext } from 'react';
import { ethers, Contract } from 'ethers';
import wasmPath from 'libzeropool-rs-wasm-web/libzeropool_rs_wasm_bg.wasm';
import workerPath from 'zeropool-client-js/lib/worker.js?asset';
import { init as initZeroPool, ZeropoolClient } from 'zeropool-client-js';
import { EvmNetwork } from 'zeropool-client-js/lib/networks/evm';
import { toast } from 'react-toastify';

import { TransactionModalContext } from 'contexts';
import { TX_STATUSES } from 'constants';

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

export default () => {
  const { setTxStatus, openTxModal } = useContext(TransactionModalContext);
  const createAccount = useCallback(async privateKey => {
    const sk = Uint8Array.from(privateKey.split('').slice(2, 34));
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
      networkName: 'xdai',
      network: new EvmNetwork(RPC_URL),
    });
  }, []);

  const deposit = useCallback(async (signer, account, amount) => {
    openTxModal();
    setTxStatus(TX_STATUSES.APPROVE_TOKENS);
    const tokenABI = ['function approve(address,uint256)'];
    const token = new Contract(TOKEN_ADDRESS, tokenABI, signer);
    const tx = await token.approve(POOL_ADDRESS, parseEther(amount));
    setTxStatus(TX_STATUSES.WAITING_FOR_APPROVAL);
    await tx.wait();
    setTxStatus(TX_STATUSES.GENERATING_PROOF);
    const signFunction = (data) => signer.signMessage(ethers.utils.arrayify(data));
    const jobId = await account.deposit(TOKEN_ADDRESS, parseEther(amount), signFunction);
    setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
    await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
    setTxStatus(TX_STATUSES.DEPOSITED);
    toast.success(`Deposited ${amount} DAI.`);
  }, [setTxStatus]);

  const transfer = useCallback(async (account, to, amount) => {
    openTxModal();
    setTxStatus(TX_STATUSES.GENERATING_PROOF);
    const jobId = await account.transfer(TOKEN_ADDRESS, [{ to, amount: parseEther(amount) }]);
    setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
    await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
    setTxStatus(TX_STATUSES.TRANSFERRED);
    toast.success(`Transferred ${amount} shDAI.`);
  }, [setTxStatus]);

  const withdraw = useCallback(async (account, to, amount) => {
    openTxModal();
    setTxStatus(TX_STATUSES.GENERATING_PROOF);
    const jobId = await account.withdraw(TOKEN_ADDRESS, to, parseEther(amount));
    setTxStatus(TX_STATUSES.WAITING_FOR_RELAYER);
    await account.waitJobCompleted(TOKEN_ADDRESS, jobId);
    setTxStatus(TX_STATUSES.WITHDRAWN);
    toast.success(`Withdrawn ${amount} DAI.`);
  }, [setTxStatus]);

  return { createAccount, deposit, transfer, withdraw };
}
