import React from 'react';
import { ThemeProvider } from 'styled-components';

const white = '#FFFFFF';
const grey = '#F4F3F8';
const purple = '#754CFF';
const textNormal = '#6D6489';
const textDark = '#2A1B5B';

const light = {
  text: {
    color: {
      normal: textNormal,
      dark: textDark,
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
          disabled: textDark,
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
      color: textDark,
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
    border: '#DCD8EA',
    text: {
      color: {
        default: textDark,
        placeholder: textNormal,
      }
    },
  },
  transferInput: {
    text: {
      color: {
        default: textDark,
        small: textNormal,
      },
      weight: {
        default: 600,
        small: 400,
      }
    },
  },
  background: grey,
};

export default ({ children }) => (
  <ThemeProvider theme={light}>
    {children}
  </ThemeProvider>
);
