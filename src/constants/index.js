export const TX_STATUSES = {
  APPROVE_TOKENS: 'approve_tokens',
  APPROVED: 'approved',
  SIGN_MESSAGE: 'sign_message',
  CONFIRM_TRANSACTION: 'confirm_transaction',
  WAITING_FOR_TRANSACTION: 'waiting_for_transaction',
  GENERATING_PROOF: 'generating_proof',
  WAITING_FOR_RELAYER: 'waiting_for_relayer',
  DEPOSITED: 'deposited',
  TRANSFERRED: 'transferred',
  TRANSFERRED_MULTI: 'transferred_multi',
  WITHDRAWN: 'withdrawn',
  REJECTED: 'rejected',
  SUSPICIOUS_ACCOUNT_DEPOSIT: 'suspicious_account_deposit',
  SUSPICIOUS_ACCOUNT_WITHDRAWAL: 'suspicious_account_withdrawal',
  WRONG_NETWORK: 'wrong_network',
  SWITCH_NETWORK: 'switch_network',
};

export const NETWORKS = {
  11155111: {
    name: 'Sepolia',
    icon: require('assets/polygon.svg').default,
    blockExplorerUrls: {
      address: 'https://sepolia.etherscan.io/address/%s',
      tx: 'https://sepolia.etherscan.io/tx/%s',
    },
  },
  137: {
    name: 'Polygon',
    icon: require('assets/polygon.svg').default,
    blockExplorerUrls: {
      address: 'https://polygonscan.com/address/%s',
      tx: 'https://polygonscan.com/tx/%s',
    },
  },
  5: {
    name: 'Goerli',
    icon: require('assets/eth.svg').default,
    blockExplorerUrls: {
      address: 'https://goerli.etherscan.io/address/%s',
      tx: 'https://goerli.etherscan.io/tx/%s',
    },
  },
  420: {
    name: 'Goerli Optimism',
    icon: require('assets/optimism.svg').default,
    blockExplorerUrls: {
      address: 'https://goerli-optimism.etherscan.io/address/%s',
      tx: 'https://goerli-optimism.etherscan.io/tx/%s',
    },
  },
  10: {
    name: 'Optimism',
    icon: require('assets/optimism.svg').default,
    blockExplorerUrls: {
      address: 'https://optimistic.etherscan.io/address/%s',
      tx: 'https://optimistic.etherscan.io/tx/%s',
    },
  },
};

export const TOKENS_ICONS = {
  'ETH': require('assets/eth.svg').default,
  'WETH': require('assets/weth.png'),
  'BOB': require('assets/bob.svg').default,
};

export const CONNECTORS_ICONS = {
  'MetaMask': require('assets/metamask.svg').default,
  'WalletConnect': require('assets/walletconnect.svg').default,
  'WalletConnectLegacy': require('assets/walletconnect.svg').default,
};

export const INCREASED_LIMITS_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RESYNC: 'resync',
};
