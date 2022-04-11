export const TX_STATUSES = {
  APPROVE_TOKENS: 'approve_tokens',
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
};
