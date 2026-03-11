import React from 'react';
import { ThemeProvider } from 'styled-components';

const white = '#FFFFFF';
const grey = '#F4F3F8';
const darkGrey = '#DCD8EA';
const blue = 'rgba(83, 83, 211, 0.90)';
const blueDisabled = 'rgba(83, 83, 211, 0.10)';
const blueHover = 'rgba(83, 83, 211, 1)';
const purpleLight = '#8052E0';
const purpleExtraLight = '#B96BCD';
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
    blue,
    blueDisabled,
    blueHover,
    purpleLight,
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
        disabled: blueDisabled,
        contrast: blueDisabled,
        hover: blueHover,
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
        color: blue,
      },
    },
  },
  tab: {
    background: {
      default: white,
      active: blueDisabled,
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
      checked: blue,
    },
    border: {
      color: {
        default: darkGrey,
        focus: 'rgba(22, 67, 206, 0.90)',
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
      hover: blueDisabled,
    },
    border: {
      default: darkGrey,
      hover: blue,
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
  background: 'linear-gradient(284deg, #DBE1FF 10.09%, #FAFAF9 100%)',
  background2: 'linear-gradient(211.28deg, #F7C23B 19.66%, rgba(232, 110, 255, 0.5) 57.48%, rgba(255, 255, 255, 0.5) 97.74%)'
};


export default ({ children }) => (
  <ThemeProvider theme={light}>
    {children}
  </ThemeProvider>
);
