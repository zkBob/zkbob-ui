import { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { isMobile } from 'react-device-detect';

import {
  useAccount, useSignMessage, useConnect, useDisconnect,
  useBalance, useProvider, useSigner, useNetwork,
  useSwitchNetwork,
} from 'wagmi';

import TronWeb from 'tronweb';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';

import PoolContext from 'contexts/PoolContext';

import config from 'config';

const WalletContext = createContext({});

export default WalletContext;

const useEvmWallet = pool => {
  const { address, connector } = useAccount();
  const provider = useProvider({ chainId: pool.chainId });
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { refetch } = useBalance({ address, chainId: pool.chainId });
  const { data: signer } = useSigner({ chainId: pool.chainId });
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: pool.chainId,
    throwForSwitchChainNotSupported: true,
  });

  const getBalance = useCallback(async () => {
    let balance = ethers.constants.Zero;
    try {
      const { data: { value } } = await refetch();
      balance = value;
    } catch (error) {}
    return balance;
  }, [refetch]);

  const callContract = useCallback(async (address, abi, method, params = [], isSend = false) => {
    const contract = new ethers.Contract(address, abi, isSend ? signer : provider);
    return contract[method](...params);
  }, [provider, signer]);

  return {
    address,
    chain,
    provider,
    signer,
    connector,
    connectors,
    connect: connectAsync,
    disconnect: disconnectAsync,
    sign: message => signMessageAsync({ message }),
    signMessage: message => signMessageAsync({ message }),
    signTypedData: (domain, types, message) => signer?._signTypedData(domain, types, message),
    sendTransaction: ({ to, value, data }) => signer?.sendTransaction({ to, value, data }),
    switchNetwork: switchNetworkAsync,
    getBalance,
    callContract,
    waitForTx: tx => tx.wait(),
    isAddress: ethers.utils.isAddress,
    isTron: false,
  };
};

const convertWalletToConnector = wallet => ({
  ...wallet.adapter,
  id: wallet.adapter.name.toLowerCase(),
  ready: !['Loading', 'NotFound'].includes(wallet.state),
  isTron: true,
});

const useTronWallet = pool => {
  const { address, disconnect, select, wallet, wallets, signMessage } = useWallet();

  const connector = useMemo(() => wallet ? convertWalletToConnector(wallet) : null, [wallet]);
  const connectors = useMemo(() => wallets.map(convertWalletToConnector), [wallets]);

  const [chainId, setChainId] = useState(null);

  const tronWeb = useMemo(() =>
    new TronWeb({
      fullHost: config.chains[pool.chainId].rpcUrls[0],
      privateKey: '01',
      headers: { 'TRON-PRO-API-KEY': process.env.REACT_APP_TRONGRID_API_KEY },
    }),
  [pool]);

  useEffect(() => {
    async function updateChainId() {
      const { chainId } = await wallet.adapter.network();
      setChainId(BigNumber.from(chainId).toNumber());
    }
    if (wallet) {
      updateChainId();
      wallet.adapter.on('chainChanged', updateChainId);
      return () => wallet.adapter.removeAllListeners();
    }
  }, [wallet]);

  const getBalance = async () => {
    let balance = ethers.constants.Zero;
    if (address && tronWeb) {
      try {
        const result = await tronWeb.trx.getBalance(address);
        balance = BigNumber.from(result);
      } catch (error) {
        console.error(error);
      }
    }
    return balance;
  }

  const callContract = async (contractAddress, abi, method, params = [], isSend = false) => {
    const tronWebInstance = isSend ? window.tronWeb : tronWeb;
    if (!tronWebInstance) throw new Error('TronWeb not found');
    const contract = await tronWebInstance.contract(abi, contractAddress);
    return contract[method](...params)[isSend ? 'send' : 'call']();
  }

  const waitForTx = async tx => {
    if (!tronWeb) throw new Error('TronWeb not found');
    async function wait(attempt = 0) {
      const response = await tronWeb.trx.getTransactionInfo(tx);
      if (!response.receipt) {
        if (attempt > 60) throw new Error('Response timeout');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return wait(attempt + 1);
      }
      if (response.receipt.result !== 'SUCCESS') throw new Error('Transaction failed');
      return response;
    }
    return wait();
  }

  const signTypedData = async (domain, types, message) => {
    if (!window.tronWeb) throw new Error('TronWeb not found');
    return window.tronWeb.trx._signTypedData(domain, types, message);
  }

  // used for signing nullifier
  const sign = async message => {
    if (!window.tronWeb) throw new Error('TronWeb not found');
    return window.tronWeb.trx.sign(message);
  }

  const switchNetwork = useCallback(async () => {
    const chainIdHex = ethers.utils.hexValue(pool.chainId);
    await wallet.adapter.switchChain(chainIdHex);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [pool, wallet]);

  return {
    address,
    chain: { id: chainId },
    connector,
    connectors,
    connect: ({ connector }) => select(connector.name),
    disconnect,
    sign,
    signMessage,
    signTypedData,
    sendTransaction: () => {},
    switchNetwork,
    getBalance,
    callContract,
    waitForTx,
    isAddress: TronWeb.isAddress,
    isTron: true,
  };
};


export const WalletContextProvider = ({ children }) => {
  const { currentPool } = useContext(PoolContext);
  const evmWallet = useEvmWallet(currentPool);
  const tronWallet = useTronWallet(currentPool);

  const wallet = currentPool.isTron ? tronWallet : evmWallet;

  const noWalletInstalled = useMemo(() =>
    currentPool.isTron && tronWallet.connectors.length === 1 && !tronWallet.connectors[0].ready,
    [currentPool, tronWallet.connectors]
  );

  const isMobileTronLink = useMemo(() => isMobile && currentPool.isTron, [currentPool.isTron]);

  return (
    <WalletContext.Provider value={{ ...wallet, noWalletInstalled, isMobileTronLink, evmWallet, tronWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
