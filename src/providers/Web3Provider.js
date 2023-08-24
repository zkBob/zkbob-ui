import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { sepolia, polygon, goerli, optimism, optimismGoerli } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider, webSocketProvider } = configureChains(
  process.env.REACT_APP_CONFIG === 'dev' ? [sepolia, goerli, optimismGoerli] : [polygon, optimism],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: chain => {
        if (chain.id === optimism.id) {
          return ({ http: 'https://rpc.ankr.com/optimism' });
        }
        if (chain.id === sepolia.id) {
          return ({ http: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' });
        }
        return null;
      }
    }),
    publicProvider({ priority: 1 }),
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
