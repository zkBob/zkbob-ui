import { useEffect, useState, useContext, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { ethers, BigNumber } from 'ethers';

import SupportIdContext from 'contexts/SupportIdContext';

import zp from 'contexts/ZkAccountContext/zp';


export function useTokenList(chainId) {
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    async function getTokenList() {
      try {
        const url = `https://api.1inch.io/v5.2/${chainId}/tokens`;
        const data = await (await fetch(url)).json();
        setTokenList(Object.values(data.tokens));
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Payment.useTokenList' } });
      }
    }
    getTokenList();
  }, [chainId]);

  return tokenList;
}

export function useTokenAmount(pool, toToken, rawAmount) {
  const [tokenAmount, setTokenAmount] = useState(ethers.constants.Zero);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    if (!rawAmount || !pool) return;
    const amount = ethers.utils.parseUnits(rawAmount, pool.tokenDecimals);
    const handler = setTimeout(() => setAmount(amount), 500);
    return () => clearTimeout(handler);
  }, [rawAmount, pool]);

  useEffect(() => {
    if (!pool || !toToken || !amount) return;
    async function getSwapDetails() {
      try {
        const apiUrl = `https://api.1inch.io/v5.2/${pool.chainId}/quote`;
        let params = `?src=${pool.tokenAddress}&dst=${toToken}&amount=${amount.toString()}`;
        const reverseSwapData = await (await fetch(`${apiUrl}${params}`)).json();
        params = `?src=${toToken}&dst=${pool.tokenAddress}&amount=${reverseSwapData.toAmount}`;
        const swapData = await (await fetch(`${apiUrl}${params}`)).json();
        setTokenAmount(BigNumber.from(reverseSwapData.toAmount));
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Payment.useSwapDetails' } });
      }
    }
    getSwapDetails();
  }, [pool, toToken, amount]);

  return tokenAmount;
}

export function useLimitsAndFees(pool) {
  const { supportId } = useContext(SupportIdContext);
  const [zkClient, setZkClient] = useState(null);
  const [limit, setLimit] = useState(ethers.constants.Zero);
  const [isLoadingLimit, setIsLoadingLimit] = useState(true);
  const [fee, setFee] = useState(ethers.constants.Zero);
  const [isLoadingFee, setIsLoadingFee] = useState(true);

  useEffect(() => {
    if (!supportId || !pool || zkClient) return;
    async function create() {
      const client = await zp.createClient(pool.alias, supportId);
      setZkClient(client);
    }
    create();
  }, [supportId, pool, zkClient]);

  const updateLimit = useCallback(async () => {
    setIsLoadingLimit(true);
    let limit = ethers.constants.Zero;
    try {
      const data = await zkClient.getLimits();
      const wei = await zkClient.shieldedAmountToWei(data.dd.components.singleOperation);
      limit = BigNumber.from(wei);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Payment.useZkClient.updateLimit' } });
    }
    setLimit(limit);
    setIsLoadingLimit(false);
  }, [zkClient]);

  const updateFee = useCallback(async () => {
    setIsLoadingFee(true);
    let fee = ethers.constants.Zero;
    try {
      // const data = await zkClient.directDepositFee();
      // const wei = await zkClient.shieldedAmountToWei(data);
      const wei = '100000';
      fee = BigNumber.from(wei);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Payment.useZkClient.updateFee' } });
    }
    setFee(fee);
    setIsLoadingFee(false);
  }, [zkClient]);

  useEffect(() => {
    if (!zkClient) return;
    updateLimit();
    updateFee();
  }, [zkClient, updateLimit, updateFee]);

  return { limit, isLoadingLimit, fee, isLoadingFee };
}
