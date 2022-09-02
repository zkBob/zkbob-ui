import { TOKEN_SYMBOL } from 'constants';

import icon from 'assets/bob.svg';

export function tokenSymbol() {
  return TOKEN_SYMBOL;
}

export function tokenIcon() {
  return icon;
}

export async function createPermitSignature(tokenContractInstance, signer, spenderAddress, value, deadline, salt) {
  const [ownerAddress, chainId] = await Promise.all([signer.getAddress(), signer.getChainId()]);
  const [contractName, nonce] = await Promise.all([
    tokenContractInstance.name(),
    tokenContractInstance.nonces(ownerAddress),
  ]);

  // The domain
  const domain = {
    name: contractName,
    version: '1',
    chainId,
    verifyingContract: tokenContractInstance.address,
  };

  // The named list of all type definitions
  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: "salt", type: "bytes32" }
    ],
  };

  // The data to sign
  const message = {
    owner: ownerAddress,
    spender: spenderAddress,
    value: value.toString(),
    nonce: nonce.toString(),
    deadline: deadline.toString(),
    salt,
  };

  const signature = await signer._signTypedData(domain, types, message);

  // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
  const MIN_VALID_V_VALUE = 27;
  let sigV = parseInt(signature.slice(-2), 16);
  if (sigV < MIN_VALID_V_VALUE) {
    sigV += MIN_VALID_V_VALUE
  }

  return signature.slice(0, -2) + sigV.toString(16);
}
