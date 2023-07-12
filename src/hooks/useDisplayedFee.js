import { useMemo, useContext } from 'react';
import { ethers } from 'ethers';

import { TokenPriceContext } from 'contexts';
import { formatNumber } from 'utils';

export default (currentPool, fee) => {
  const { price } = useContext(TokenPriceContext);

  return useMemo(() => {
    let displayedFee = `${formatNumber(fee)} ${currentPool.tokenSymbol}`;
    if (currentPool.isNative && price) {
      displayedFee += ` ($${formatNumber(fee.mul(price).div(ethers.constants.WeiPerEther))})`;
    }
    return displayedFee;
  }, [fee, price, currentPool]);
};
