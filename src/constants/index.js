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
  SENT: 'sent',
  PREPARING_TRANSACTION: 'preparing_transaction',
};

export const NETWORKS = {
  11155111: {
    name: 'Sepolia',
    icon: require('assets/sepolia.svg').default,
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
    icon: require('assets/goerli.svg').default,
    blockExplorerUrls: {
      address: 'https://eth-goerli.blockscout.com/address/%s',
      tx: 'https://eth-goerli.blockscout.com/tx/%s',
    },
  },
  420: {
    name: 'Goerli Optimism',
    icon: require('assets/optimism.svg').default,
    blockExplorerUrls: {
      address: 'https://optimism-goerli.blockscout.com/address/%s',
      tx: 'https://optimism-goerli.blockscout.com/tx/%s',
    },
  },
  10: {
    name: 'Optimism',
    icon: require('assets/optimism.svg').default,
    blockExplorerUrls: {
      address: 'https://optimism.blockscout.com/address/%s',
      tx: 'https://optimism.blockscout.com/tx/%s',
    },
  },
  2494104990: {
    name: 'Shasta',
    icon: require('assets/tron.png'),
    blockExplorerUrls: {
      address: 'https://shasta.tronscan.org/#/address/%s',
      tx: 'https://shasta.tronscan.org/#/transaction/%s',
    },
  },
  3448148188: {
    name: 'Nile',
    icon: require('assets/tron.png'),
    blockExplorerUrls: {
      address: 'https://nile.tronscan.org/#/address/%s',
      tx: 'https://nile.tronscan.org/#/transaction/%s',
    },
  },
  728126428: {
    name: 'Tron',
    icon: require('assets/tron.png'),
    blockExplorerUrls: {
      address: 'https://tronscan.org/#/address/%s',
      tx: 'https://tronscan.org/#/transaction/%s',
    },
  }
};

export const TOKENS_ICONS = {
  'ETH': require('assets/eth.svg').default,
  'WETH': require('assets/weth.png'),
  'BOB': require('assets/bob.svg').default,
  'USDM': require('assets/usdc.svg').default,
  'USDC': require('assets/usdc.svg').default,
  'USDC.e': require('assets/usdc.svg').default,
  'USDT': require('assets/usdt.png'),
  'USDT*': require('assets/usdt.png'),
};

export const CONNECTORS_ICONS = {
  'MetaMask': require('assets/metamask.svg').default,
  'WalletConnect': require('assets/walletconnect.svg').default,
  'WalletConnectLegacy': require('assets/walletconnect.svg').default,
  'TronLink': require('assets/tronlink.png'),
};

export const INCREASED_LIMITS_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RESYNC: 'resync',
};

export const PERMIT2_CONTRACT_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

export const SUPPORT_URL = 'https://discord.com/channels/1095673887389392916/1112786753133220042';
