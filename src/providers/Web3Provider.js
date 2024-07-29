import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { sepolia, polygon, goerli, optimism, optimismGoerli } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import config from  '../config'


const getRpcByPriority = (priority) => {

  return ({id}) => {
    const allChains = Array.from(Object.entries(config.chains));
    const [_, selectedChain] = allChains.find(([chainId, _ ]) => chainId == id);
    const len = selectedChain?.rpcUrls.length;
    let res;
    if (len > priority-1)
     {
       res =  ({http: selectedChain.rpcUrls[priority]})
    } else {
       res = ({http: selectedChain.rpcUrls[priority%len]})
    };
    return res;
  }

}

const networks = process.env.REACT_APP_CONFIG === 'dev' ? [sepolia, goerli, optimismGoerli, optimism] : [polygon, optimism];
console.log('networks', networks)
const { chains, provider, webSocketProvider } = configureChains(
  networks,
  [
    jsonRpcProvider({
      priority: 0,
      rpc: getRpcByPriority(0)}),
      jsonRpcProvider({priority:1,
        rpc: getRpcByPriority(1)}),
    jsonRpcProvider({priority:2,
      rpc: getRpcByPriority(2)}),
      jsonRpcProvider({priority:3,
        rpc: getRpcByPriority(3)})
  ],
);

const injected = new InjectedConnector({
  chains,
  options: {
    name: 'MetaMask',
  },
});

const walletConnect = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
    projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
    name: 'zkBob',
    relayUrl: 'wss://relay.walletconnect.org'
  },
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [injected, walletConnect],
});

export default ({ children }) => (
  <WagmiConfig client={client}>
    {children}
  </WagmiConfig>
);
