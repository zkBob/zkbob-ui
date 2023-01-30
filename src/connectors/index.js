import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

import metaMaskIcon from 'assets/metamask.svg';
import walletConnectIcon from 'assets/walletconnect.svg';

const injected = new InjectedConnector({ supportedChainIds: [Number(process.env.REACT_APP_NETWORK)] });
const walletconnect = new WalletConnectConnector({
  rpc: {
    [Number(process.env.REACT_APP_NETWORK)]: process.env.REACT_APP_RPC_URL,
  },
});

const defaultConnectors = {
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

const getConnectors = () => {
  let connectors = defaultConnectors;
  if (!window?.ethereum) {
    delete connectors['injected'];
  }
  return connectors;
}

export default getConnectors();
