import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { ZkAccountContext, PoolContext } from 'contexts';


export default (txType, relayerFee, amountToConvert) => {
  const { currentPool } = useContext(PoolContext);
  const { calcMaxTransferable, balance } = useContext(ZkAccountContext);
  const [max, setMax] = useState(ethers.constants.Zero);

  useEffect(() => {
    async function updateMax() {
      const max = await calcMaxTransferable(txType, relayerFee, amountToConvert);
      setMax(max);
    }
    updateMax();
  }, [txType, relayerFee, amountToConvert, calcMaxTransferable, currentPool, balance]);

  return max;
};
