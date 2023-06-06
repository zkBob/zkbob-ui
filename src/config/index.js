const config = {
  prod: {
    defaultPool: 'BOB-polygon',
    pools: {
      'BOB-polygon': {
        chainId: 137,
        poolAddress: '0x72e6B59D4a90ab232e55D4BB7ed2dD17494D62fB',
        tokenAddress: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
        relayerUrls: ['https://relayer-mvp.zkbob.com'],
        delegatedProverUrls: ['https://remoteprover-mvp.zkbob.com/'],
        coldStorageConfigPath: 'https://r2.zkbob.com/coldstorage/coldstorage.cfg',
        kycUrls: {
          status: 'https://api.knowyourcat.id/v1/%s/categories?category=BABTokenBOB',
          homepage: 'https://knowyourcat.id/address/%s/BABTokenBOB',
        },
      },
      'BOB-optimism': {
        chainId: 10,
        poolAddress: '0x1CA8C2B9B20E18e86d5b9a72370fC6c91814c97C',
        tokenAddress: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
        relayerUrls: ['https://relayer-optimism.zkbob.com/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
      },
    },
    chains: {
      '137': {
        rpcUrls: ['https://polygon-rpc.com'],
      },
      '10': {
        rpcUrls: ['https://rpc.ankr.com/optimism'],
      },
    },
    snarkParams: {
      transferParamsUrl: 'https://r2.zkbob.com/transfer_params_22022023.bin',
      transferVkUrl: 'https://r2.zkbob.com/transfer_verification_key_22022023.json'
    },
  },
  dev: {
    defaultPool: 'BOB-sepolia',
    pools: {
      'BOB-sepolia': {
        chainId: 11155111,
        poolAddress: '0x3bd088C19960A8B5d72E4e01847791BD0DD1C9E6',
        tokenAddress: '0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f',
        relayerUrls: ['https://relayer.thgkjlr.website/'],
        delegatedProverUrls: ['https://prover-staging.thgkjlr.website/'],
        coldStorageConfigPath: 'https://r2-staging.zkbob.com/coldstorage/coldstorage.cfg',
        kycUrls: {
          status: 'https://api-stage.knowyourcat.id/v1/%s/categories?category=BABTokenBOB',
          homepage: 'https://stage.knowyourcat.id/address/%s/BABTokenBOB',
        },
      },
      'BOB-goerli': {
        chainId: 5,
        poolAddress: '0x49661694a71B3Dab9F25E86D5df2809B170c56E6',
        tokenAddress: '0x97a4ab97028466FE67F18A6cd67559BAABE391b8',
        relayerUrls: ['https://dev-relayer.thgkjlr.website/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: ''
      },
      'BOB-op-goerli': {
        chainId: 420,
        poolAddress:'0x55B81b0730399974Ccad8AC858e766Cf54126596',
        tokenAddress:'0x0fA7E69b9344D6434Bd6b79c5950bb5234245a5F',
        relayerUrls:['https://gop-relayer.thgkjlr.website'],
        delegatedProverUrls: [],
        coldStorageConfigPath: ''
      }
    },
    chains: {
      '11155111': {
        rpcUrls: ['https://rpc.sepolia.org'],
      },
      '5': {
        rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161']
      },
      '420': {
        rpcUrls: ['https://goerli.optimism.io']
      }
    },
    snarkParams: {
      transferParamsUrl: 'https://r2-staging.zkbob.com/transfer_params_20022023.bin',
      transferVkUrl: 'https://r2-staging.zkbob.com/transfer_verification_key_20022023.json'
    },
  }
};

export default config[process.env.REACT_APP_CONFIG || 'dev'];
