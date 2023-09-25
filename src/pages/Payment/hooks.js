import { useEffect, useState, useContext, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { ethers, BigNumber } from 'ethers';
import { useAccount, useSigner, useNetwork, useSwitchNetwork, useProvider } from 'wagmi';
import { LiFi } from '@lifi/sdk';
import { Multicall } from 'ethereum-multicall';
import { useTranslation } from 'react-i18next';

import SupportIdContext from 'contexts/SupportIdContext';
import TransactionModalContext from 'contexts/TransactionModalContext';

import zp from 'contexts/ZkAccountContext/zp';

import { TX_STATUSES, NETWORKS } from 'constants';

import { formatNumber } from 'utils';
import { createPermitSignature, getPermitType, getNullifier } from './utils';

const lifi = new LiFi({
  integrator: 'zkBob',
});

const MULTIPLIER = BigNumber.from('1000000'); // 100%
const MIN_DIFF = BigNumber.from('1000'); // 0.1%
const TARGET_DIFF = BigNumber.from('4000'); // 0.4%
const MAX_DIFF = BigNumber.from('10000'); // 1.0%

const TOKEN_ABI = ['function balanceOf(address) pure returns (uint256)'];

export function useTokensBalances(tokenList, chainId) {
  const { address: account } = useAccount();
  const provider = useProvider({ chainId });
  const [balances, setBalances] = useState({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);

  const updateBalance = useCallback(async () => {
    setIsLoadingBalances(true);
    let balances = {};
    if (account && tokenList.length > 0) {
      try {
        const multicall = new Multicall({ ethersProvider: provider });
        const contractCallContext = tokenList.map(token => ({
          reference: token.address,
          contractAddress: token.address,
          abi: TOKEN_ABI,
          calls: [{ reference: token.address, methodName: 'balanceOf', methodParameters: [account] }],
        }));
        const data = await Promise.all([
          provider.getBalance(account),
          multicall.call(contractCallContext),
        ]);
        balances[ethers.constants.AddressZero] = data[0];
        delete data[1].results[ethers.constants.AddressZero];
        Object.values(data[1].results).forEach(({ callsReturnContext }) => {
          balances[callsReturnContext[0].reference] = BigNumber.from(callsReturnContext[0].returnValues);
        });
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Payment.useTokenBalace' } });
      }
    }
    setBalances(balances);
    setIsLoadingBalances(false);
  }, [account, provider, tokenList]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return { balances, isLoadingBalances };
}

export function useTokenList(pool) {
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    async function getTokenList() {
      try {
        const lifiUrl = `https://li.quest/v1/tokens?chains[]=${pool.chainId}`;
        const oneInchUrl = `https://tokens.1inch.io/v1.2/${pool.chainId}`;
        const [lifiData, oneInchData] = await Promise.all(
          [lifiUrl, oneInchUrl].map(url => fetch(url).then(res => res.json()))
        );
        let tokens = lifiData.tokens[pool.chainId];
        tokens = tokens.map(token => ({ ...token, eip2612: oneInchData[token.address]?.eip2612 }));
        const index = tokens.findIndex(token => token.address === pool.tokenAddress);
        if (index > 0) {
          tokens.unshift(tokens.splice(index, 1)[0]);
        }
        setTokenList(tokens);
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Payment.useTokenList' } });
      }
    }
    getTokenList();
  }, [pool]);

  return tokenList;
}

export function useTokensWithBalances(pool) {
  const tokenList = useTokenList(pool);
  const { balances, isLoadingBalances } = useTokensBalances(tokenList, pool.chainId);
  const [tokenListWithBalances, setTokenListWithBalances] = useState([]);

  useEffect(() => {
    const tokenListWithBalances = tokenList.map(token => {
      let balanceUSD = null;
      if (token.priceUSD && balances[token.address]) {
        const priceBN = ethers.utils.parseEther(Number(token.priceUSD).toFixed(18));
        const balanceUsdBN = balances[token.address].mul(priceBN).div(ethers.constants.WeiPerEther);
        balanceUSD = formatNumber(balanceUsdBN, token?.decimals || 18);
      }
      return {
        ...token,
        balance: balances[token.address],
        balanceUSD,
      };
    });
    const sorted = tokenListWithBalances.sort((a, b) => {
      if (a.balanceUSD === null) return 1;
      if (b.balanceUSD === null) return -1;
      return b.balanceUSD - a.balanceUSD;
    });
    setTokenListWithBalances(sorted);
  }, [balances, tokenList]);

  return { tokens: tokenListWithBalances, isLoadingBalances };
}


export function useTokenAmount(pool, fromToken, enteredAmount, fee) {
  const [amount, setAmount] = useState(ethers.constants.Zero);
  const [liFiRoute, setLiFiRoute] = useState(null);
  const [isTokenAmountLoading, setIsTokenAmountLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setAmount(enteredAmount), 500);
    return () => clearTimeout(handler);
  }, [enteredAmount, pool]);

  useEffect(() => {
    if (!pool || !fromToken) return;
    if (amount.isZero()) {
      setLiFiRoute(null);
      return;
    }
    setLiFiRoute({ estimate: { fromAmount: ethers.constants.Zero } });

    const amountWithFee = amount.add(fee);

    const isPoolToken = pool.tokenAddress.toLowerCase() === fromToken.toLowerCase();
    const isUnwrappedPoolToken = pool.isNative && fromToken === ethers.constants.AddressZero;
    if (isPoolToken || isUnwrappedPoolToken) {
      setLiFiRoute({ estimate: { fromAmount: amountWithFee } });
      return;
    }
    async function getSwapDetails() {
      setIsTokenAmountLoading(true);
      try {
        const minAmount = amountWithFee.mul(MIN_DIFF.add(MULTIPLIER)).div((MULTIPLIER));
        const targetAmount = amountWithFee.mul(TARGET_DIFF.add(MULTIPLIER)).div((MULTIPLIER));
        const maxAmount = amountWithFee.mul(MAX_DIFF.add(MULTIPLIER)).div((MULTIPLIER));

        const opts = {
          fromChainId: pool.chainId,
          fromAmount: targetAmount.toString(),
          fromTokenAddress: pool.tokenAddress,
          fromAddress: pool.paymentContractAddress,
          toChainId: pool.chainId,
          toTokenAddress: fromToken,
          toAddress: pool.paymentContractAddress,
        };
        const routes = await lifi.getRoutes(opts);
        if (routes.routes.length === 0) {
          throw new Error("no routes found");
        }
        const estimatedTokenAmount = BigNumber.from(routes.routes[0].toAmount);

        [opts.fromTokenAddress, opts.toTokenAddress] = [opts.toTokenAddress, opts.fromTokenAddress];

        async function findLiFiRoute(tokenAmount, attempt = 0) {
          if (attempt > 10) throw new Error('Too many attempts');
          opts.fromAmount = tokenAmount.toString();
          const routes = await lifi.getRoutes(opts);
          if (routes.routes.length === 0) {
            throw new Error("no routes found");
          }
          const receivedAmount = BigNumber.from(routes.routes[0].toAmount);

          if (receivedAmount.gte(minAmount) && receivedAmount.lte(maxAmount)) {
            return routes.routes[0].steps[0];
          }
          return findLiFiRoute(tokenAmount.mul(targetAmount).div(receivedAmount), attempt + 1);
        }
        const liFiRoute = await findLiFiRoute(estimatedTokenAmount);
        setLiFiRoute(liFiRoute);
      } catch (error) {
        setLiFiRoute(null);
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'Payment.useSwapDetails' } });
      }
      setIsTokenAmountLoading(false);
    }
    getSwapDetails();
    const intervalId = setInterval(getSwapDetails, 20000); // 20 seconds
    return () => clearInterval(intervalId);
  }, [pool, fromToken, amount, fee]);

  return { tokenAmount: BigNumber.from(liFiRoute?.estimate?.fromAmount || '0'), liFiRoute, isTokenAmountLoading };
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
      const data = await zkClient.directDepositFee();
      const wei = await zkClient.shieldedAmountToWei(data);
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

export function usePayment(token, tokenAmount, amount, fee, pool, zkAddress, liFiRoute) {
  const { openTxModal, setTxStatus, setTxHash, setTxError, setCsvLink } = useContext(TransactionModalContext);
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner({ chainId: pool.chainId });
  const provider = useProvider({ chainId: pool.chainId });
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: pool.chainId,
    throwForSwitchChainNotSupported: true,
  });

  const send = useCallback(async () => {
    openTxModal();
    try {
      if (chain.id !== pool.chainId) {
        setTxStatus(TX_STATUSES.SWITCH_NETWORK);
        try {
          await switchNetworkAsync();
        } catch (error) {
          console.error(error);
          Sentry.captureException(error, { tags: { method: 'ZkAccountContext.deposit.switchNetwork' } });
          setTxStatus(TX_STATUSES.WRONG_NETWORK);
          return;
        }
      }

      const isNative = token.address === ethers.constants.AddressZero;
      let permitSignature = '0x';
      if (!isNative) {
        setTxStatus(TX_STATUSES.SIGN_MESSAGE);
        const permitType = getPermitType(token, pool.chainId);
        const deadline = Math.floor((Date.now() + 1000 * 60 * 60 * 24 * 365) / 1000); // 1 year
        const nullifier = getNullifier(permitType);
        const rawSignature = await createPermitSignature(
          permitType,
          pool.chainId,
          token.address,
          provider,
          signer,
          account,
          pool.paymentContractAddress,
          tokenAmount,
          deadline,
          nullifier,
        );
        const compactSignature = ethers.utils.splitSignature(rawSignature).compact;
        permitSignature = ethers.utils.solidityPack(['uint256','uint256','bytes'], [nullifier, deadline, compactSignature]);
      }

      setTxStatus(TX_STATUSES.PREPARING_TRANSACTION);
      let router ='0x0000000000000000000000000000000000000000';
      let routerData ='0x';
      const isPoolToken = pool.tokenAddress.toLowerCase() === token.address.toLowerCase();
      const isUnwrappedPoolToken = pool.isNative && token.address === ethers.constants.AddressZero;
      if (isUnwrappedPoolToken) {
        router = pool.tokenAddress;
        routerData = '0xd0e30db0';
      } else if (!isPoolToken) {
        let liFiTx;
        try {
          liFiTx = await lifi.getStepTransaction(liFiRoute);
          router = liFiTx.transactionRequest.to;
          routerData = liFiTx.transactionRequest.data;
        } catch (error) {
          throw new Error('Error getting exchange data. Please try again.');
        }
        if (BigNumber.from(liFiTx.estimate.toAmount).lt(amount.add(fee))) {
          throw new Error('The exchange rate was changed. Please try again.');
        }
      }

      setTxStatus(TX_STATUSES.CONFIRM_TRANSACTION);
      const paymentABI = ['function pay(bytes,address,uint256,uint256,bytes,address,bytes,bytes) external payable'];
      const paymentContractInstance = new ethers.Contract(pool.paymentContractAddress, paymentABI, signer);
      const note = '0x';
      const decodedZkAddress = ethers.utils.hexlify(ethers.utils.base58.decode(zkAddress.split(':')[1]));
      const tx = await paymentContractInstance.pay(
        decodedZkAddress,
        isNative ? ethers.constants.AddressZero : token.address,
        isUnwrappedPoolToken ? ethers.constants.Zero : tokenAmount,
        amount.add(fee),
        permitSignature,
        router,
        routerData,
        note,
        {
          value: isNative ? tokenAmount : ethers.constants.Zero,
          gasLimit: 2000000,
        },
      );
      setTxStatus(TX_STATUSES.WAITING_FOR_TRANSACTION);
      await tx.wait();
      setTxHash(tx.hash);
      const rows = [
        [
          t('paymentStatement.amount', { symbol: 'USD' }),
          t('paymentStatement.amount', { symbol: token.symbol }),
          t('common.sender'),
          t('common.recipient'),
          t('paymentStatement.fee', { symbol: 'USD' }),
          t('common.link'),
        ],
        [
          ethers.utils.formatUnits(amount, pool.tokenDecimals),
          ethers.utils.formatUnits(tokenAmount, token.decimals),
          account,
          zkAddress,
          ethers.utils.formatUnits(fee, pool.tokenDecimals),
          NETWORKS[pool.chainId].blockExplorerUrls.tx.replace('%s', tx.hash),
        ],
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
      setCsvLink(encodeURI(csvContent));
      setTxStatus(TX_STATUSES.SENT);
    } catch (error) {
      let message = error?.message;
      if (message?.includes('user rejected transaction')) {
        message = 'User rejected transaction.';
      }
      console.error(error);
      Sentry.captureException(error, { tags: { method: 'Payment.usePayment.send' } });
      setTxError(message);
      setTxStatus(TX_STATUSES.REJECTED);
    }
  }, [
    chain, pool, token, tokenAmount, account, provider, signer,
    openTxModal, setTxStatus, setTxError, switchNetworkAsync,
    zkAddress, fee, amount, setTxHash, liFiRoute, t, setCsvLink,
  ]);

  return { send };
}
