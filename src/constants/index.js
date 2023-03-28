export const TX_STATUSES = {
  APPROVE_TOKENS: 'approve_tokens',
  SIGN_MESSAGE: 'sign_message',
  WAITING_FOR_APPROVAL: 'waiting_for_approval',
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
    icon: require('assets/ethereum.svg').default,
  },
  137: {
    name: 'Polygon',
    icon: require('assets/polygon.svg').default,
  },
  5: {
    name: 'Goerli',
    icon: require('assets/ethereum.svg').default,
  },
};

export const TOKEN_SYMBOL = process.env.REACT_APP_TOKEN_SYMBOL || 'BOB';

export const HISTORY_ACTION_TYPES = {
  DEPOSIT: 1,
  TRANSFER_IN: 2,
  TRANSFER_OUT: 3,
  WITHDRAWAL: 4,
  TRANSFER_SELF: 5,
  DIRECT_DEPOSIT: 6,
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
