import React, { useContext } from 'react';
import { LiFiWidget } from '@lifi/widget';

import { PoolContext } from 'contexts';
import { useWindowDimensions } from 'hooks';

import config from 'config';

export default () => {
  const { currentPool } = useContext(PoolContext);
  const { width } = useWindowDimensions();

  const widgetConfig = {
    integrator: 'zkBob',
    fee: 0.00075,
    variant: 'standard',
    appearance: 'light',
    disableAppearance: true,
    containerStyle: {
      width: width > 500 ? 480 : '100%',
      maxWidth: width > 500 ? 480 : '100%',
    },
    theme: {
      typography: {
        fontFamily: 'Gilroy'
      },
      palette: {
        primary: { main: '#1B4DEB' },
        secondary: { main: '#754CFF' },
      },
      components: {
        MuiAvatar: {
          defaultProps: {
            imgProps: { crossOrigin: 'anonymous' },
          },
        },
      },
    },
    fromChain: 1,
    fromToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    toChain: config.pools[currentPool].chainId,
    toToken: config.pools[currentPool].tokenAddress,
    disableTelemetry: true,
  };

  return (
    <LiFiWidget config={widgetConfig} />
  );
};
