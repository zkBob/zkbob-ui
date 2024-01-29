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
        tokenSymbol: 'USDC.e',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc-polygon',
        minTxAmount: 50000000n, // 0.05 USDC
        ddSubgraph: 'zkbob-usdc-polygon',
        migration: {
          timestamp: 1689689468,
          prevTokenSymbol: 'BOB',
        },
        addressPrefix: 'zkbob_polygon',
        paymentContractAddress: '0x76a911E76fC78F39e73cE0c532F8866ac28Dfe43',
      },
      'BOB2USDC-optimism': {
        chainId: 10,
        poolAddress: '0x1CA8C2B9B20E18e86d5b9a72370fC6c91814c97C',
        tokenAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        relayerUrls: ['https://relayer-optimism.zkbob.com/'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDC',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc',
        minTxAmount: 50000000n, // 0.05 USDC
        ddSubgraph: 'zkbob-bob-optimism',
        migration: {
          timestamp: 1696854269,
          prevTokenSymbol: 'BOB',
        },
        addressPrefix: 'zkbob_optimism',
        paymentContractAddress: '0x860513FbdC4B6B2B210e1D393BE244F1d0b1Babd',
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
        addressPrefix: 'zkbob_optimism_eth',
        paymentContractAddress: '0x7a8006Ea0Dda93C56E60187Bd55109AbfF486c6F',
      },
      'USDT-tron': {
        chainId: 728126428,
        poolAddress: 'TXViaNRhEugXpAZApviBqBnbTSKUgejnR9',
        tokenAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        relayerUrls: ['https://relayer-tron-mpc.zkbob.com'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDT',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'approve',
        minTxAmount: 50000n, // 0.05 USDT
        addressPrefix: 'zkbob_tron',
        isTron: true,
      },
    },
    chains: {
      '137': {
        rpcUrls: ['https://polygon-rpc.com'],
      },
      '10': {
        rpcUrls: ['https://rpc.ankr.com/optimism'],
      },

      '728126428': {
        rpcUrls: ['https://few-methodical-breeze.tron-mainnet.quiknode.pro/c9e0de7204463ff25a6ca3afd1bd32caf880561e', 'https://api.trongrid.io'],
        external: "https://tron.zkbob.com/"
      },
    },
    snarkParams: process.env.REACT_APP_HOSTING === 'netlify' ? {
      transferParamsUrl: 'https://r2.zkbob.com/transfer_params_22022023.bin',
      transferVkUrl: 'https://r2.zkbob.com/transfer_verification_key_22022023.json',
    } : {
      transferParamsUrl: 'https://5tqpkqtbrkd5ookgni4yydvxgsnaazxl53pdgymjgkiaqwb56lzq.arweave.net/7OD1QmGKh9c5Rmo5jA63NJoAZuvu3jNhiTKQCFg98vM',
      transferVkUrl: 'https://rhm3gvehfvhrnll2cuuem2s77hruahjgifqctaw7ld2z37ehpcta.arweave.net/idmzVIctTxatehUoRmpf-eNAHSZBYCmC31j1nfyHeKY',
    },
  },
  dev: {
    defaultPool: 'USDC-goerli',
    pools: {
      // 'BOB-sepolia': {
      //   chainId: 11155111,
      //   poolAddress: '0x3bd088C19960A8B5d72E4e01847791BD0DD1C9E6',
      //   tokenAddress: '0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f',
      //   relayerUrls: ['https://relayer.thgkjlr.website/'],
      //   delegatedProverUrls: ['https://prover-staging.thgkjlr.website/'],
      //   coldStorageConfigPath: 'https://r2-staging.zkbob.com/coldstorage/coldstorage.cfg',
      //   kycUrls: {
      //     status: 'https://api-stage.knowyourcat.id/v1/%s/categories?category=BABTokenBOB',
      //     homepage: 'https://stage.knowyourcat.id/address/%s/BABTokenBOB',
      //   },
      //   tokenSymbol: 'BOB',
      //   tokenDecimals: 18,
      //   feeDecimals: 2,
      //   depositScheme: 'permit',
      //   addressPrefix: 'zkbob_sepolia',
      // },
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
        addressPrefix: 'zkbob_goerli',
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
        addressPrefix: 'zkbob_goerli_usdc',
      },
      // 'BOB-op-goerli': {
      //   chainId: 420,
      //   poolAddress:'0x55B81b0730399974Ccad8AC858e766Cf54126596',
      //   tokenAddress:'0x0fA7E69b9344D6434Bd6b79c5950bb5234245a5F',
      //   relayerUrls:['https://gop-relayer.thgkjlr.website'],
      //   delegatedProverUrls: [],
      //   coldStorageConfigPath: '',
      //   tokenSymbol: 'BOB',
      //   tokenDecimals: 18,
      //   feeDecimals: 2,
      //   depositScheme: 'permit',
      //   addressPrefix: 'zkbob_goerli_optimism',
      // },
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
        addressPrefix: 'zkbob_goerli_eth',
      },
      'USDT-nile': {
        chainId: 3448148188,
        poolAddress: 'TT8GgygLhEDh88kYwY8mYz38iEpJWw1YLG',
        tokenAddress: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        relayerUrls: ['https://tron-nile-relayer.thgkjlr.website'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDT',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'approve',
        minTxAmount: 50000n, // 0.05 USDT
        addressPrefix: 'zkbob_nile',
        isTron: true,
      },
      'USDT-nile-guard': {
        chainId: 3448148188,
        poolAddress: 'TVbFjwMgDuzVYqTmMMzrkGQxZkaTfDZ1Gn',
        tokenAddress: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
        relayerUrls: ['https://tron-nile-mpc-relayer.thgkjlr.website'],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDT*',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'approve',
        minTxAmount: 50000n, // 0.05 USDT
        addressPrefix: 'zkbob_nile_g',
        isTron: true,
      },
    },
    chains: {
      '11155111': {
        rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      },
      '5': {
        rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161']
      },
      '420': {
        rpcUrls: ['https://goerli.optimism.io']
      },
      '3448148188': {
        rpcUrls: ['https://nile.trongrid.io'],
        external: "https://deploy-preview-250--shimmering-douhua-023cc6.netlify.app"
      },
    },
    snarkParams: {
      transferParamsUrl: 'https://r2-staging.zkbob.com/transfer_params_20022023.bin',
      transferVkUrl: 'https://r2-staging.zkbob.com/transfer_verification_key_20022023.json'
    },
    extraPrefixes: [
      {
        poolId: 16776968,
        prefix: 'zkbob_nile_g',
        name: 'USDT on Nile testnet (MPC guard contracts)',
      },
    ],
  }
};

export default config[process.env.REACT_APP_CONFIG || 'dev'];
