import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { sepolia, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider, webSocketProvider } = configureChains(
  [Number(process.env.REACT_APP_NETWORK) === 137 ? polygon : sepolia],
  [publicProvider()],
);

const injected = new InjectedConnector({ chains });
const walletConnectV1 = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
});
const walletConnectV2 = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
    version: '2',
    projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
    name: 'zkBob',
    relayUrl: 'wss://relay.walletconnect.org'
  },
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [injected, walletConnectV1, walletConnectV2],
});

export default ({ children }) => (
  <WagmiConfig client={client}>
    {children}
  </WagmiConfig>
);
