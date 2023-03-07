import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { sepolia, polygon, goerli } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';

const chainsMap = {
  '137': polygon,
  '11155111': sepolia,
  '5': goerli,
};

const { chains, provider, webSocketProvider } = configureChains(
  [chainsMap[process.env.REACT_APP_NETWORK]],
  [publicProvider()],
);

const injected = new InjectedConnector({
  chains,
  options: {
    name: 'MetaMask',
  },
});
const walletConnectV1 = new WalletConnectLegacyConnector({
  chains,
  options: {
    qrcode: true,
  },
});
const walletConnectV2 = new WalletConnectConnector({
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
  connectors: [injected, walletConnectV1, walletConnectV2],
});

export default ({ children }) => (
  <WagmiConfig client={client}>
    {children}
  </WagmiConfig>
);
