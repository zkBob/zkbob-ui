export async function createPermitSignature(tokenContractInstance, signer, spenderAddress, value, deadline) {
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
      { name: 'deadline', type: 'uint256' }
    ],
  };

  // The data to sign
  const message = {
    owner: ownerAddress,
    spender: spenderAddress,
    value: value.toString(),
    nonce: nonce.toString(),
    deadline: deadline.toString(),
  };

  return signer._signTypedData(domain, types, message);
}
