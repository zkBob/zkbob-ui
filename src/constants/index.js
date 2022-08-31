export const TX_STATUSES = {
  APPROVE_TOKENS: 'approve_tokens',
  SIGN_MESSAGE: 'sign_message',
  WAITING_FOR_APPROVAL: 'waiting_for_approval',
  GENERATING_PROOF: 'generating_proof',
  WAITING_FOR_RELAYER: 'waiting_for_relayer',
  DEPOSITED: 'deposited',
  TRANSFERRED: 'transferred',
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
  },
  137: {
    name: 'Polygon',
    tokenName: 'MATIC',
    tokenSymbol: 'MATIC',
    rpcUrl: process.env.REACT_APP_RPC_URL,
    blockExplorerUrl: process.env.REACT_APP_EXPLORER_URL,
  },
};

export const TOKEN_SYMBOL = process.env.REACT_APP_TOKEN_SYMBOL || 'BOB';
