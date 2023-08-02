import { useEffect, useState, useContext, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { ethers, BigNumber } from 'ethers';

import SupportIdContext from 'contexts/SupportIdContext';

import zp from 'contexts/ZkAccountContext/zp';

const MULTIPLIER = BigNumber.from('1000000'); // 100%
const MAX_DIFF = BigNumber.from('1015000'); // 101.5%

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

export function useTokenAmount(pool, toToken, rawAmount, fee) {
  const [amount, setAmount] = useState(ethers.constants.Zero);
  const [tokenAmount, setTokenAmount] = useState(ethers.constants.Zero);
  const [isTokenAmountLoading, setIsTokenAmountLoading] = useState(false);

  useEffect(() => {
    if (!rawAmount || !pool) {
      setAmount(ethers.constants.Zero);
      return;
    }
    const amount = ethers.utils.parseUnits(rawAmount, pool.tokenDecimals);
    const handler = setTimeout(() => setAmount(amount), 500);
    return () => clearTimeout(handler);
  }, [rawAmount, pool]);

  useEffect(() => {
    if (!pool || !toToken) return;
    if (amount.isZero()) {
      setTokenAmount(ethers.constants.Zero);
      return;
    }
    async function getSwapDetails() {
      setIsTokenAmountLoading(true);
      try {
        const apiUrl = `https://api.1inch.io/v5.2/${pool.chainId}/quote`;
        const params = `?src=${pool.tokenAddress}&dst=${toToken}&amount=${amount.add(fee).toString()}`;
        const data = await (await fetch(`${apiUrl}${params}`)).json();
        const estimatedTokenAmount = BigNumber.from(data.toAmount);

        async function matchTokenAmount(tokenAmount) {
          const params = `?src=${toToken}&dst=${pool.tokenAddress}&amount=${tokenAmount}`;
          const data = await (await fetch(`${apiUrl}${params}`)).json();
          const receivedAmount = BigNumber.from(data.toAmount);
          const diff = receivedAmount.mul(MULTIPLIER).div(amount.add(fee));
          if (diff.gte(MULTIPLIER) && diff.lte(MAX_DIFF)) {
            return tokenAmount;
          }
          return matchTokenAmount(tokenAmount.div(diff).mul(MULTIPLIER));
        }
        const tokenAmount = await matchTokenAmount(estimatedTokenAmount);
        setTokenAmount(tokenAmount);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Payment.useSwapDetails' } });
      }
      setIsTokenAmountLoading(false);
    }
    getSwapDetails();
    const intervalId = setInterval(getSwapDetails, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, [pool, toToken, amount, fee]);

  return { tokenAmount, isTokenAmountLoading };
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
