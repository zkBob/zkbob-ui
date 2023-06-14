import icon from 'assets/bob.svg';

export function tokenIcon() {
  return icon;
}

export async function createPermitSignature(tokenContractInstance, signer, spenderAddress, value, deadline, salt) {
  let ownerAddress;
  let chainId;
  let contractName;
  let nonce;

  try {
    [ownerAddress, chainId] = await Promise.all([signer.getAddress(), signer.getChainId()]);
    [contractName, nonce] = await Promise.all([
      tokenContractInstance.name(),
      tokenContractInstance.nonces(ownerAddress),
    ]);
  } catch (error) {
    console.error(error);
    throw Error('Network request failed, please try again or setup a different rpc url in your wallet.');
  }

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

  let signature;
  try {
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
