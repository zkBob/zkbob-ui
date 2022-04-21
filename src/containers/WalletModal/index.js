import { useCallback, useEffect, useContext } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

import { ModalContext } from 'contexts';
import WalletModal from 'components/WalletModal';

import connectors from 'connectors';
import { NETWORKS } from 'constants';

async function switchChainInMetaMask(chainId) {
  const network = NETWORKS[chainId];
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: ethers.utils.hexValue(Number(chainId)),
        },
      ],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ethers.utils.hexValue(Number(chainId)),
              chainName: network.name,
              nativeCurrency: {
                name: network.tokenName,
                symbol: network.tokenSymbol,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.log(addError);
      }
    } else {
      console.log(switchError);
    }
    return false;
  }
};

export default () => {
  const { isWalletModalOpen, closeWalletModal } = useContext(ModalContext);
  const { activate, chainId, connector } = useWeb3React();

  const activateConnector = useCallback(async connector => {
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      console.log(error);
      if (error instanceof UnsupportedChainIdError) {
        const chainId = process.env.REACT_APP_NETWORK;
        toast.warn(`Wrong network. Please connect to ${NETWORKS[chainId].name}.`);
        const success = await switchChainInMetaMask(chainId);
        if (success) {
          activateConnector(connector);
        }
      }
    }
  }, [activate]);

  const connectWallet = useCallback(async connector => {
    await activateConnector(connector);
    closeWalletModal();
  }, [activateConnector, closeWalletModal]);

  useEffect(() => {
    async function connect() {
      const isAuthorized = await connectors.injected.connector.isAuthorized();
      if (isAuthorized && (connector instanceof InjectedConnector || !connector)) {
        activateConnector(connectors.injected.connector);
      }
    }
    connect();
  }, [activateConnector, chainId, connector]);

  return (
    <WalletModal
      isOpen={isWalletModalOpen}
      onClose={closeWalletModal}
      connectors={Object.values(connectors)}
      connectWallet={connectWallet}
    />
  );
}
