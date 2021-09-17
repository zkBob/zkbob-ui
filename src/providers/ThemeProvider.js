import React from 'react';
import { ThemeProvider } from 'styled-components';

const white = '#FFFFFF';
const grey = '#F4F3F8';
const darkGrey = '#DCD8EA';
const purple = '#754CFF';
const textNormal = '#6D6489';
const darkPurple = '#2A1B5B';
const orange = '#EF8726';

const light = {
  text: {
    color: {
      primary: darkPurple,
      secondary: textNormal,
    },
    weight: {
      normal: 400,
      bold: 600,
    },
  },
  button: {
    primary: {
      background: {
        default: purple,
        disabled: grey,
        gradient: 'linear-gradient(90deg, #6D5CFF 5.4%, #E86EFF 55.92%, #FFD66E 92.38%)',
      },
      text: {
        color: {
          default: white,
          disabled: darkPurple,
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
      active: grey,
    },
  },
  networkLabel: {
    background: white,
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
    border: darkGrey,
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
      },
      weight: {
        default: 600,
        small: 400,
      }
    },
  },
  modal: {
    background: white,
    overlay: 'rgba(42, 27, 91, 0.9)',
  },
  walletConnectorOption: {
    background: {
      default: grey,
      hover: 'rgba(117, 76, 255, 0.1)',
    },
    border: {
      default: darkGrey,
      hover: purple,
    },
  },
  warning: {
    background: 'rgba(239, 135, 38, 0.1)',
    border: orange,
    text: {
      color: orange,
    },
  },
  background: grey,
};

export default ({ children }) => (
  <ThemeProvider theme={light}>
    {children}
  </ThemeProvider>
);
