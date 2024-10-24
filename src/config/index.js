const config = {
  prod: {
    defaultPool: 'BOB2USDC-polygon',
    pools: {
      'BOB2USDC-polygon': {
        chainId: 137,
        poolAddress: '0x72e6B59D4a90ab232e55D4BB7ed2dD17494D62fB',
        tokenAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
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
        depositScheme: 'usdc',
        minTxAmount: 50000000n, // 0.05 USDC
        ddSubgraph: 'zkbob-usdc-polygon',
        migrations: [{
          timestamp: 1689689468,
          prevTokenSymbol: 'BOB',
        }, {
          timestamp: 1700481600,
          prevTokenSymbol: 'USDC.e',
        }],
        addressPrefix: 'zkbob_polygon',
        paymentContractAddress: '0x76a911E76fC78F39e73cE0c532F8866ac28Dfe43',
        parameters:'prod',
        closingDate: '2025-02-01T00:00:00Z',
      },
      'BOB2USDC-optimism': {
        chainId: 10,
        poolAddress: '0x1CA8C2B9B20E18e86d5b9a72370fC6c91814c97C',
        tokenAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        // relayerUrls: ['https://relayer-optimism.zkbob.com/'],
        proxyUrls: ["https://proxy1.zkbob.com", "https://proxy2.zkbob.com"],
        delegatedProverUrls: [],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDC',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc',
        minTxAmount: 50000000n, // 0.05 USDC
        ddSubgraph: 'zkbob-bob-optimism',
        migrations: [{
          timestamp: 1696854269,
          prevTokenSymbol: 'BOB',
        }],
        addressPrefix: 'zkbob_optimism',
        paymentContractAddress: '0x860513FbdC4B6B2B210e1D393BE244F1d0b1Babd',
        parameters:'prod'
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
        parameters:'prod'
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
        parameters:'prod'
      },
    },
    chains: {
      '137': {
        rpcUrls: ['https://rpc.ankr.com/polygon', 'https://polygon-rpc.com', 'https://polygon-mainnet.g.alchemy.com/v2/fnUqqB1tThPuSpM33VFm26wqXISKPS2n'],
      },
      '10': {
        rpcUrls: ['https://mainnet.optimism.io','https://optimism.llamarpc.com','https://optimism.gateway.tenderly.co'],
      },

      '728126428': {
        rpcUrls: ['https://few-methodical-breeze.tron-mainnet.quiknode.pro/c9e0de7204463ff25a6ca3afd1bd32caf880561e', 'https://api.trongrid.io'],
        external: "https://tron.zkbob.com/"
      },
    },
    "snarkParamsSet": {
      "prod": process.env.REACT_APP_HOSTING === 'netlify' ? {
        transferParamsUrl: 'https://r2.zkbob.com/transfer_params_22022023.bin',
        transferVkUrl: 'https://r2.zkbob.com/transfer_verification_key_22022023.json',
      } : {
        transferParamsUrl: 'https://5tqpkqtbrkd5ookgni4yydvxgsnaazxl53pdgymjgkiaqwb56lzq.arweave.net/7OD1QmGKh9c5Rmo5jA63NJoAZuvu3jNhiTKQCFg98vM',
        transferVkUrl: 'https://rhm3gvehfvhrnll2cuuem2s77hruahjgifqctaw7ld2z37ehpcta.arweave.net/idmzVIctTxatehUoRmpf-eNAHSZBYCmC31j1nfyHeKY',
      },
      "prod-arweave": {
        transferParamsUrl: 'https://5tqpkqtbrkd5ookgni4yydvxgsnaazxl53pdgymjgkiaqwb56lzq.arweave.net/7OD1QmGKh9c5Rmo5jA63NJoAZuvu3jNhiTKQCFg98vM',
        transferVkUrl: 'https://rhm3gvehfvhrnll2cuuem2s77hruahjgifqctaw7ld2z37ehpcta.arweave.net/idmzVIctTxatehUoRmpf-eNAHSZBYCmC31j1nfyHeKY',
      }
  }
  },
  //   snarkParams: process.env.REACT_APP_HOSTING === 'netlify' ? {
  //     transferParamsUrl: 'https://r2.zkbob.com/transfer_params_22022023.bin',
  //     transferVkUrl: 'https://r2.zkbob.com/transfer_verification_key_22022023.json',
  //   } : {
  //     transferParamsUrl: 'https://5tqpkqtbrkd5ookgni4yydvxgsnaazxl53pdgymjgkiaqwb56lzq.arweave.net/7OD1QmGKh9c5Rmo5jA63NJoAZuvu3jNhiTKQCFg98vM',
  //     transferVkUrl: 'https://rhm3gvehfvhrnll2cuuem2s77hruahjgifqctaw7ld2z37ehpcta.arweave.net/idmzVIctTxatehUoRmpf-eNAHSZBYCmC31j1nfyHeKY',
  //   },
  // },
  dev: {
    defaultPool: 'zkbob_sepolia',
    pools: {
      'zkbob_sepolia': {
        chainId: 11155111,
        poolAddress: '0x77f3D9Fb578a0F2B300347fb3Cd302dFd7eedf93',
        tokenAddress: '0x2C74B18e2f84B78ac67428d0c7a9898515f0c46f',
        proxyUrls: ['https://sepolia-decentralized-relayer.thgkjlr.website'],
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
        addressPrefix: 'zkbob_sepolia',
        parameters:'staging'
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
        migrations: [{
          timestamp: 1688651376,
          prevTokenSymbol: 'BOB',
        }],
        addressPrefix: 'zkbob_goerli',
        parameters:'staging'
      },
      'USDC-OP-tenderly': {
        chainId: 10,
        parameters: "prod",
        poolAddress: "0x1CA8C2B9B20E18e86d5b9a72370fC6c91814c97C",
        tokenAddress: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        delegatedProverUrls: [],
        proxyUrls: ["https://sepolia-proxy.zkbob.evgen.space", "https://sepolia-decentralized-relayer.thgkjlr.website"],
        coldStorageConfigPath: '',
        tokenSymbol: 'USDC',
        tokenDecimals: 6,
        feeDecimals: 2,
        depositScheme: 'usdc',
        parameters: 'prod-arweave',
        minTxAmount: 50000n, // 0.05 USDC
        addressPrefix: 'zkbob_optimism',
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
        parameters:'staging'
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
        parameters:'staging'
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
        parameters:'staging'
      },
    },
    "snarkParamsSet": {
      "prod": process.env.REACT_APP_HOSTING === 'netlify' ? {
        transferParamsUrl: 'https://r2.zkbob.com/transfer_params_22022023.bin',
        transferVkUrl: 'https://r2.zkbob.com/transfer_verification_key_22022023.json',
      } : {
        transferParamsUrl: 'https://5tqpkqtbrkd5ookgni4yydvxgsnaazxl53pdgymjgkiaqwb56lzq.arweave.net/7OD1QmGKh9c5Rmo5jA63NJoAZuvu3jNhiTKQCFg98vM',
        transferVkUrl: 'https://rhm3gvehfvhrnll2cuuem2s77hruahjgifqctaw7ld2z37ehpcta.arweave.net/idmzVIctTxatehUoRmpf-eNAHSZBYCmC31j1nfyHeKY',
      },
      "staging": {
        transferParamsUrl: 'https://r2-staging.zkbob.com/transfer_params_20022023.bin',
        transferVkUrl: 'https://r2-staging.zkbob.com/transfer_verification_key_20022023.json'
      },
      "prod-arweave": {
        transferParamsUrl: 'https://5tqpkqtbrkd5ookgni4yydvxgsnaazxl53pdgymjgkiaqwb56lzq.arweave.net/7OD1QmGKh9c5Rmo5jA63NJoAZuvu3jNhiTKQCFg98vM',
        transferVkUrl: 'https://rhm3gvehfvhrnll2cuuem2s77hruahjgifqctaw7ld2z37ehpcta.arweave.net/idmzVIctTxatehUoRmpf-eNAHSZBYCmC31j1nfyHeKY',
      }
  },
    chains: {
      '11155111': {
        rpcUrls: ['https://sepolia.infura.io/v3/9a94d181b23846209f01161dcd0f9ad6'],
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
      '10': {
        rpcUrls:["https://virtual.optimism.rpc.tenderly.co/fb1a77c3-e7f5-4622-aee5-85025a99a658"]
      },
    },
    // snarkParams: {
    //   transferParamsUrl: 'https://r2-staging.zkbob.com/transfer_params_20022023.bin',
    //   transferVkUrl: 'https://r2-staging.zkbob.com/transfer_verification_key_20022023.json'
    // },
    extraPrefixes: [
      {
        poolId: 16776968,
        prefix: 'zkbob_nile_g',
        name: 'USDT on Nile testnet (MPC guard contracts)',
      },
      {
        poolId: 16776969,
        prefix: 'zkbob_sepolia',
        name: 'Bob Pool on Sepolia with decentralized relayer',
      },
    ],
  }

};

export default config[process.env.REACT_APP_CONFIG || 'dev'];
