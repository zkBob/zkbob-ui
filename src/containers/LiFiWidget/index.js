import React from 'react';
import { LiFiWidget } from '@lifi/widget';

export default () => {
  const widgetConfig = {
    integrator: 'zkBob',
    variant: 'standard',
    appearance: 'light',
    disableAppearance: true,
    containerStyle: {
      maxWidth: 480,
      width: 480,
    },
    theme: {
      typography: {
        fontFamily: 'Gilroy'
      },
      palette: {
        primary: { main: '#1B4DEB' },
        secondary: { main: '#754CFF' },
      },
    },
    toChain: 137,
    toToken: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
  };

  return (
    <LiFiWidget config={widgetConfig} />
  );
};
