const config = {
  prod: {
    defaultPool: 'BOB2USDC-polygon',
    pools: {
      'BOB2USDC-polygon': {
        chainId: 137,
        poolAddress: '0x72e6B59D4a90ab232e55D4BB7ed2dD17494D62fB',
        tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        relayerUrls: ['https://relayer-mvp.zkbob.com'],
        delegatedProverUrls: ['https://remoteprover-mvp.zkbob.com/'],
        coldStorageConfigPath: 'https://r2.zkbob.com/coldstorage/coldstorage.cfg',
        kycUrls: {
          status: 'https://api.knowyourcat.id/v1/%s/categories?category=BABTokenBOB',
          homepage: 'https://knowyourcat.id/address/%s/BABTokenBOB',
        },
        tokenSymbol: 'USDC',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc-polygon',
        minTxAmount: 50000n, // 0.05 USDC
        ddSubgraph: 'zkbob-usdc-polygon',
        migration: {
          timestamp: 1689689468,
          prevTokenSymbol: 'BOB',
        },
      },
      'BOB-optimism': {
        chainId: 10,
        poolAddress: '0x1CA8C2B9B20E18e86d5b9a72370fC6c91814c97C',
        tokenAddress: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
        relayerUrls: ['https://relayer-optimism.zkbob.com/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'BOB',
        tokenDecimals: 18,
        feeDecimals: 2,
        depositScheme: 'permit',
        ddSubgraph: 'zkbob-bob-optimism',
      },
      'WETH-optimism': {
        chainId: 10,
        poolAddress:'0x58320A55bbc5F89E5D0c92108F762Ac0172C5992',
        tokenAddress:'0x4200000000000000000000000000000000000006',
        relayerUrls:['https://relayer-eth-opt-mvp.zkbob.com/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        kycUrls: {
          status: 'https://api.knowyourcat.id/v1/%s/categories?category=BABTokenBOB',
          homepage: 'https://knowyourcat.id/address/%s/BABTokenBOB/10',
        },
        tokenSymbol: 'ETH',
        tokenDecimals: 18,
        isNative: true,
        depositScheme: 'permit2',
        minTxAmount: 1000000n, // 0.001 ETH
        ddSubgraph: 'zkbob-eth-optimism',
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
        tokenSymbol: 'BOB',
        tokenDecimals: 18,
        feeDecimals: 2,
        depositScheme: 'permit',
      },
      'BOB2USDC-goerli': {
        chainId: 5,
        poolAddress: '0x49661694a71B3Dab9F25E86D5df2809B170c56E6',
        tokenAddress: '0x28B531401Ee3f17521B3772c13EAF3f86C2Fe780',
        relayerUrls: ['https://dev-relayer.thgkjlr.website/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDM',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc-polygon',
        ddSubgraph: 'zkbob-bob-goerli',
        migration: {
          timestamp: 1688651376,
          prevTokenSymbol: 'BOB',
        },
      },
      'USDC-goerli': {
        chainId: 5,
        poolAddress: '0xCF6446Deb67b2b56604657C67DAF54f884412531',
        tokenAddress: '0x28B531401Ee3f17521B3772c13EAF3f86C2Fe780',
        relayerUrls: ['https://goerli-usdc-relayer.thgkjlr.website'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDC',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc-polygon',
        minTxAmount: 50000n, // 0.05 USDC
      },
      'BOB-op-goerli': {
        chainId: 420,
        poolAddress:'0x55B81b0730399974Ccad8AC858e766Cf54126596',
        tokenAddress:'0x0fA7E69b9344D6434Bd6b79c5950bb5234245a5F',
        relayerUrls:['https://gop-relayer.thgkjlr.website'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'BOB',
        tokenDecimals: 18,
        feeDecimals: 2,
        depositScheme: 'permit',
      },
      'WETH-goerli': {
        chainId: 5,
        poolAddress:'0xf9dbCF4005497e042838dE9082C817fCa790e945',
        tokenAddress:'0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        relayerUrls:['https://goerli-weth-relayer.thgkjlr.website/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'ETH',
        tokenDecimals: 18,
        isNative: true,
        depositScheme: 'permit2',
        minTxAmount: 1000000n, // 0.001 ETH
        ddSubgraph: 'zkbob-eth-goerli',
      },
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
