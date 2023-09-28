import { createContext, useContext } from 'react';
import {
  useAccount, useSignMessage, useConnect, useDisconnect,
  useBalance, useProvider, useSigner, useNetwork,
  useSwitchNetwork,
} from 'wagmi';

import PoolContext from 'contexts/PoolContext';

const WalletContext = createContext({});

export default WalletContext;

const useEvmWallet = () => {
  const { currentPool: pool } = useContext(PoolContext);
  const { address, connector } = useAccount();
  const provider = useProvider({ chainId: pool.chainId });
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { refetch: getBalance } = useBalance({ address, chainId: pool.chainId });
  const { data: signer } = useSigner({ chainId: pool.chainId });
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: pool.chainId,
    throwForSwitchChainNotSupported: true,
  });

  return {
    address,
    chain,
    provider,
    signer,
    connector,
    connectors,
    connect: connectAsync,
    disconnect: disconnectAsync,
    signMessage: signMessageAsync,
    switchNetwork: switchNetworkAsync,
    getBalance,
  };
};


export const WalletContextProvider = ({ children }) => {
  const wallet = useEvmWallet();
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};
