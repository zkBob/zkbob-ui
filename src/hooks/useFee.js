import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { TxType } from 'zkbob-client-js';

import { ZkAccountContext } from 'contexts';

export default (amount, txType) => {
  const { estimateFee } = useContext(ZkAccountContext);
  const [fee, setFee] = useState(ethers.constants.Zero);
  const [numberOfTxs, setNumberOfTxs] = useState(ethers.constants.Zero);

  useEffect(() => {
    async function updateFee() {
      let fee;
      let numberOfTxs;
      if (!amount.isZero() || txType === TxType.Deposit) {
        const data = await estimateFee(amount, txType);
        fee = data?.fee;
        numberOfTxs = data?.numberOfTxs;
      }
      setFee(fee || ethers.constants.Zero);
      setNumberOfTxs(numberOfTxs || ethers.constants.Zero);
    }
    updateFee();
  }, [amount, txType, estimateFee]);

  return { fee, numberOfTxs };
};
