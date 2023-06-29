import { useMemo, useContext } from 'react';
import { ethers } from 'ethers';

import { TokenPriceContext } from 'contexts';
import { formatNumber } from 'utils';

export default (currentPool, fee) => {
  const { price } = useContext(TokenPriceContext);

  return useMemo(() =>
    currentPool.isNativeToken && price
      ? '$' + formatNumber(fee.mul(price).div(ethers.constants.WeiPerEther))
      : `${formatNumber(fee)} ${currentPool.tokenSymbol}`,
    [fee, price, currentPool]
  );
};
