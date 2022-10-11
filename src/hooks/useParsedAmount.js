import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default (displayAmount) => {
  const [amount, setAmount] = useState(ethers.constants.Zero);

  useEffect(() => {
    let amount = ethers.constants.Zero;
    try {
      amount = ethers.utils.parseEther(displayAmount);
    } catch (error) {}
    setAmount(amount);
  }, [displayAmount]);

  return amount;
};
