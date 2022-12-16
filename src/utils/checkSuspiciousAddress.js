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
    return !data.result;
  } catch (error) {
    return false;
  }
}

export default checkSuspiciousAddress;
