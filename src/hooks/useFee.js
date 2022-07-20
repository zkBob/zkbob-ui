import { useState, useEffect, useContext } from 'react';

import { ZkAccountContext } from 'contexts';

export default (amount, txType) => {
  const { estimateFee } = useContext(ZkAccountContext);
  const [fee, setFee] = useState(0);
  const [numberOfTxs, setNumberOfTxs] = useState(0);

  useEffect(() => {
    async function updateFee() {
      let fee;
      let numberOfTxs;
      if (amount > 0) {
        const data = await estimateFee(amount, txType);
        fee = data?.fee;
        numberOfTxs = data?.numberOfTxs;
      }
      setFee(fee || 0);
      setNumberOfTxs(numberOfTxs || 0);
    }
    updateFee();
  }, [amount, txType, estimateFee]);

  return { fee, numberOfTxs };
};
