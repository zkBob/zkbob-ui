import { ethers, BigNumber } from 'ethers';

import { PERMIT2_CONTRACT_ADDRESS } from 'constants';
import tokenAbi from 'abis/token.json';

export function getPermitType(token, chainId) {
  if (token?.symbol === 'USDC.e' && chainId === 137) return 'permit-usdc-polygon';
  if (token?.symbol === 'USDC') return 'permit-usdc';
  if (token?.eip2612) return 'permit';
  return 'permit2';
}

export function getNullifier(permitType) {
  if (permitType === 'permit') return ethers.constants.Zero;
  let min, max;
  if (permitType === 'permit2') {
    min = BigNumber.from(2).pow(248);
    max = BigNumber.from(2).pow(249).sub(1);
  } else {
    min = BigNumber.from(1);
    max = BigNumber.from(2).pow(248).sub(1);
  }
  const random = ethers.BigNumber.from(ethers.utils.randomBytes(32));
  return random.mod(max.sub(min)).add(min);
}

async function getNameAndNonce(tokenAddress, ownerAddress, provider) {
  const tokenContractInstance = new ethers.Contract(tokenAddress, tokenAbi, provider);
  const [name, nonce] = await Promise.all([
    tokenContractInstance.name(),
    tokenContractInstance.nonces(ownerAddress),
  ]);
  return { name, nonce };
}

async function permit({ tokenAddress, chainId, ownerAddress, spenderAddress, value, deadline, provider }) {
  const { name, nonce } = await getNameAndNonce(tokenAddress, ownerAddress, provider);

  const domain = {
    name,
    version: '1',
    chainId,
    verifyingContract: tokenAddress,
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const message = {
    owner: ownerAddress,
    spender: spenderAddress,
    value: value.toString(),
    nonce: nonce.toString(),
    deadline: deadline.toString(),
  };

  return { domain, types, message };
}

async function permit2({ tokenAddress, chainId, spenderAddress, value, deadline, nullifier }) {
  const domain = {
    name: 'Permit2',
    chainId,
    verifyingContract: PERMIT2_CONTRACT_ADDRESS,
  };

  const types = {
    TokenPermissions: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    PermitTransferFrom: [
      { name: 'permitted', type: 'TokenPermissions' },
      { name: 'spender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const message = {
    permitted: {
      token: tokenAddress,
      amount: value.toString()
    },
    spender: spenderAddress,
    nonce: nullifier.toString(),
    deadline: deadline.toString(),
  };

  return { domain, types, message };
}

async function permitUSDC({ tokenAddress, chainId, ownerAddress, spenderAddress, value, deadline, provider, nullifier }) {
  const { name } = await getNameAndNonce(tokenAddress, ownerAddress, provider);

  const domain = {
    name,
    version: '2',
    chainId,
    verifyingContract: tokenAddress,
  };

  const types = {
    TransferWithAuthorization: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
    ],
  };

  const message = {
    from: ownerAddress,
    to: spenderAddress,
    value: value.toString(),
    validAfter: '0',
    validBefore: deadline.toString(),
    nonce: ethers.utils.hexZeroPad(ethers.utils.hexlify(nullifier), 32),
  };

  return { domain, types, message };
}

async function permitUSDCPolygon(data) {
  const { domain, types, message } = await permitUSDC(data);
  delete domain.chainId;
  domain.version = '1';
  domain.salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(data.chainId), 32);
  return { domain, types, message };
}

const permits = {
  permit,
  permit2,
  'permit-usdc': permitUSDC,
  'permit-usdc-polygon': permitUSDCPolygon,
};

export async function createPermitSignature(
  type, chainId, tokenAddress, provider, signer,
  ownerAddress, spenderAddress, value, deadline, nullifier,
) {
  let signature;
  try {
    const values = { tokenAddress, chainId, ownerAddress, spenderAddress, value, deadline, provider, nullifier };
    const { domain, types, message } = await permits[type](values);
    signature = await signer._signTypedData(domain, types, message);
  } catch (error) {
    console.error(error);
    throw Error('User denied message signature.');
  }
  if (typeof signature !== 'string') throw Error('Something went wrong.');

  // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
  const MIN_VALID_V_VALUE = 27;
  let sigV = parseInt(signature.slice(-2), 16);
  if (sigV < MIN_VALID_V_VALUE) {
    sigV += MIN_VALID_V_VALUE
  }

  return signature.slice(0, -2) + sigV.toString(16);
}
