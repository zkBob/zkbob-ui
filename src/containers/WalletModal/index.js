import { useCallback, useEffect, useContext } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

import { ModalContext } from 'contexts';
import WalletModal from 'components/WalletModal';

import connectors from 'connectors';
import { NETWORKS } from 'constants';

const chainId = process.env.REACT_APP_NETWORK;

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
  const { activate, connector, error } = useWeb3React();
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;

  const activateConnector = useCallback(async (connector, switchNetwork = false) => {
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      if (error instanceof UnsupportedChainIdError) {
        if (switchNetwork) {
          const success = await switchChainInMetaMask(chainId);
          if (success) {
            activateConnector(connector);
          }
        }
      } else {
        console.error(`WalletModal.activateConnector():\n`, error);
      }
    }
  }, [activate]);

  useEffect(() => {
    if (isUnsupportedChainIdError) {
      toast.warn(`Wrong network. Please connect to ${NETWORKS[chainId].name}.`);
    }
  }, [isUnsupportedChainIdError]);

  const connectWallet = useCallback(async connector => {
    await activateConnector(connector, true);
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
  }, [activateConnector, connector]);

  return (
    <WalletModal
      isOpen={isWalletModalOpen}
      onClose={closeWalletModal}
      connectors={Object.values(connectors)}
      connectWallet={connectWallet}
    />
  );
}
