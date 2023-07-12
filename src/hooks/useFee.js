import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

import { ZkAccountContext, PoolContext } from 'contexts';

export default (amount, txType) => {
  const { estimateFee } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const [fee, setFee] = useState(ethers.constants.Zero);
  const [relayerFee, setRelayerFee] = useState(null);
  const [directDepositFee, setDirectDepositFee] = useState(ethers.constants.Zero);
  const [numberOfTxs, setNumberOfTxs] = useState(ethers.constants.Zero);
  const [isLoadingFee, setIsLoadingFee] = useState(false);

  useEffect(() => {
    async function updateFee() {
      const timeout = setTimeout(() => setIsLoadingFee(true), 100);
      const data = await estimateFee(amount instanceof Array ? amount.map(item => item.amount) : [amount], txType);
      const fee = data?.fee;
      const numberOfTxs = data?.numberOfTxs;
      setFee(fee || ethers.constants.Zero);
      setRelayerFee(data?.relayerFee);
      setDirectDepositFee(data?.directDepositFee || ethers.constants.Zero);
      setNumberOfTxs(numberOfTxs || ethers.constants.Zero);
      clearTimeout(timeout);
      setIsLoadingFee(false);
    }
    updateFee();
    const interval = setInterval(updateFee, 5000);
    return () => clearInterval(interval);
  }, [amount, txType, estimateFee, currentPool]);

  return { fee, numberOfTxs, isLoadingFee, relayerFee, directDepositFee };
};
