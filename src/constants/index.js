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
};

export const NETWORKS = {
  42: {
    name: 'Kovan',
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorerUrl: process.env.REACT_APP_EXPLORER_URL,
  },
  11155111: {
    name: 'Sepolia',
    tokenName: 'SEP',
    tokenSymbol: 'SEP',
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorerUrl: process.env.REACT_APP_EXPLORER_URL,
    icon: require('assets/ethereum.svg').default,
  },
  137: {
    name: 'Polygon',
    tokenName: 'MATIC',
    tokenSymbol: 'MATIC',
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorerUrl: process.env.REACT_APP_EXPLORER_URL,
    icon: require('assets/polygon.svg').default,
  },
};

export const TOKEN_SYMBOL = process.env.REACT_APP_TOKEN_SYMBOL || 'BOB';

export const HISTORY_ACTION_TYPES = {
  DEPOSIT: 1,
  TRANSFER_IN: 2,
  TRANSFER_OUT: 3,
  WITHDRAWAL: 4,
  TRANSFER_SELF: 5,
};
