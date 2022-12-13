export interface MetamaskMethods {
  importWallet(): Promise<void>;
  unlock?(): Promise<void>;
  createWallet?(password?: string): Promise<void>;
  importAccount?(privateKey: string): Promise<void>;
  createAccount?(accountName?: string): Promise<void>;
  switchAccount?(accountNameOrAccountNumber: string): Promise<void>;
  changeNetwork?(network: string): Promise<void>;
  addNetwork?(network: string): Promise<void>;
}

export type CustomNetworksNames = 'Binance Smart Chain' | 'Localhost 8545';

export interface NetworkParameters {
  networkName: CustomNetworksNames;
  rpcUrl: string;
  chainId: string;
  symbol: string;
  blockExplorerUrl: string;
}
