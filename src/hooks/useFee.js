import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

import { ZkAccountContext, PoolContext } from 'contexts';

export default (amount, txType) => {
  const { estimateFee } = useContext(ZkAccountContext);
  const { currentPool } = useContext(PoolContext);
  const [fee, setFee] = useState(ethers.constants.Zero);
  const [numberOfTxs, setNumberOfTxs] = useState(ethers.constants.Zero);
  const [isLoadingFee, setIsLoadingFee] = useState(false);

  useEffect(() => {
    async function updateFee() {
      setIsLoadingFee(true);
      const data = await estimateFee([amount], txType);
      const fee = data?.fee;
      const numberOfTxs = data?.numberOfTxs;
      setFee(fee || ethers.constants.Zero);
      setNumberOfTxs(numberOfTxs || ethers.constants.Zero);
      setIsLoadingFee(false);
    }
    updateFee();
  }, [amount, txType, estimateFee, currentPool]);

  return { fee, numberOfTxs, isLoadingFee };
};
