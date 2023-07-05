import { createContext, useState, useEffect, useContext } from 'react';
import * as Sentry from '@sentry/react';
import { ethers } from 'ethers';

import { PoolContext } from 'contexts';

const TokenPriceContext = createContext({ price: null });

const getChainId = chainId => chainId === 5 ? 1 : chainId;

export default TokenPriceContext;

export const TokenPriceContextProvider = ({ children }) => {
  const { currentPool } = useContext(PoolContext);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (!currentPool.isNative) return;
    setPrice(null);
    async function getTokenPrice() {
      try {
        const url = `https://li.quest/v1/tokens?chains[]=${currentPool.chainId}`;
        const data = await (await fetch(url)).json();
        const token = data.tokens[getChainId(currentPool.chainId)].find(token => token.symbol === currentPool.tokenSymbol);
        setPrice(ethers.utils.parseEther(token.priceUSD));
      } catch (error) {
        console.error(error);
        Sentry.captureException(error, { tags: { method: 'TokenPriceContext.getTokenPrice' } });
      }
    }
    getTokenPrice();
    const interval = setInterval(getTokenPrice, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [currentPool]);

  return (
    <TokenPriceContext.Provider value={{ price }}>
      {children}
    </TokenPriceContext.Provider>
  );
};
