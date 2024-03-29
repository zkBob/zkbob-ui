import React from 'react';
import { ThemeProvider } from 'styled-components';

const white = '#FFFFFF';
const grey = '#F4F3F8';
const darkGrey = '#DCD8EA';
const purple = '#754CFF';
const purpleLight = '#8052E0';
const purpleExtraLight = '#B96BCD';
const blue = '#1B4DEB';
const blueLight = '#1B87EB';
const blueExtraLight = '#E4EBFF';
const textNormal = '#6D6489';
const darkPurple = '#2A1B5B';
const orange = '#EF8726';
const orangeLight = '#FAE4DA';
const orangeExtraLight = '#FFFAEE';
const red = '#EF102A';
const yellow = '#FBEED0';

const light = {
  color: {
    white,
    grey,
    darkGrey,
    purple,
    purpleLight,
    blue,
    blueLight,
    darkPurple,
    orange,
    orangeLight,
    orangeExtraLight,
    blueExtraLight,
    purpleExtraLight,
    yellow,
  },
  text: {
    color: {
      primary: darkPurple,
      secondary: textNormal,
      error: red,
    },
    weight: {
      normal: 400,
      bold: 600,
      extraBold: 700,
    },
  },
  button: {
    primary: {
      background: {
        default: blue,
        disabled: 'rgba(27, 77, 235, 0.2)',
        contrast: 'rgba(27, 77, 235, 0.1)',
      },
      border: {
        color: darkGrey,
      },
      text: {
        color: {
          default: white,
          contrast: darkPurple,
        },
        size: {
          small: '16px',
          default: '20px',
        },
        weight: {
          small: 400,
          default: 600,
        },
      },
    },
    link: {
      text: {
        color: purple,
      },
    },
  },
  tab: {
    background: {
      default: white,
      active: orangeLight,
    },
  },
  networkLabel: {
    background: orangeExtraLight,
  },
  card: {
    background: white,
    title: {
      color: darkPurple,
    },
    note: {
      color: textNormal,
    },
  },
  input: {
    background: {
      primary: grey,
      secondary: white,
      checked: purple,
    },
    border: {
      color: {
        default: darkGrey,
        focus: blue,
        error: red,
      },
    },
    text: {
      color: {
        default: darkPurple,
        placeholder: textNormal,
      }
    },
  },
  transferInput: {
    text: {
      color: {
        default: darkPurple,
        small: textNormal,
        placeholder: textNormal,
      },
      weight: {
        default: 600,
        small: 400,
      }
    },
  },
  modal: {
    background: white,
    overlay: 'rgba(30, 45, 95, 0.9)',
  },
  walletConnectorOption: {
    background: {
      default: grey,
      hover: 'rgba(117, 76, 255, 0.1)',
    },
    border: {
      default: darkGrey,
      hover: purple,
      light: grey,
    },
  },
  warning: {
    background: 'rgba(239, 135, 38, 0.1)',
    border: orange,
    text: {
      color: orange,
    },
  },
  mnemonic: {
    background: {
      default: white,
      active: grey,
    },
    border: {
      default: darkGrey,
      active: grey,
    },
    text: {
      color: {
        default: darkPurple,
        active: darkGrey,
      },
    },
  },
  background: 'linear-gradient(180deg, #FBEED0 0%, #FAFAF9 78.71%)',
  background2: 'linear-gradient(211.28deg, #F7C23B 19.66%, rgba(232, 110, 255, 0.5) 57.48%, rgba(255, 255, 255, 0.5) 97.74%)'
};


export default ({ children }) => (
  <ThemeProvider theme={light}>
    {children}
  </ThemeProvider>
);
