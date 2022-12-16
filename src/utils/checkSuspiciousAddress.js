async function checkSuspiciousAddress(address) {
  try {
    const response = await fetch(`${process.env.REACT_APP_TRM_URL}/wallet_screening`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        address,
        chain: 'polygon',
      }]),
    });
    const data = JSON.parse(await (response).text());

    const testAddresses = [
      '0x813399e5b08Bb50b038AA7dF6347b6AF2D161828',
      '0xF5af1e4F9969683140D7a75E3d58E4d653F734b2',
      '0xD54d956e86A6238055D5f9c80771aF9DAA4E3787'
    ];
    if (testAddresses.includes(address)) return true;

    return !data.result;
  } catch (error) {
    return false;
  }
}

export default checkSuspiciousAddress;
