import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default (displayAmount, tokenDecimals) => {
  const [amount, setAmount] = useState(ethers.constants.Zero);

  useEffect(() => {
    let amount = ethers.constants.Zero;
    try {
      amount = ethers.utils.parseUnits(displayAmount, tokenDecimals);
    } catch (error) {}
    setAmount(amount);
  }, [displayAmount, tokenDecimals]);

  return amount;
};
