import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import metaMaskIcon from 'assets/metamask.svg';
import walletConnectIcon from 'assets/walletconnect.svg';

const injected = new InjectedConnector({ supportedChainIds: [1, 100] });
const walletconnect = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.blockscout.com/',
    100: 'https://dai.poa.network',
  },
});

const connectors = {
  injected: {
    name: 'MetaMask',
    icon: metaMaskIcon,
    connector: injected,
  },
  walletconnect: {
    name: 'WalletConnect',
    icon: walletConnectIcon,
    connector: walletconnect,
  },
};

export default connectors;
