import React from 'react';
import { LiFiWidget } from '@lifi/widget';

import { useWindowDimensions } from 'hooks';

export default () => {
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
    toChain: 137,
    toToken: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
    disableTelemetry: true,
  };

  return (
    <LiFiWidget config={widgetConfig} />
  );
};
