import React from 'react';
import { ThemeProvider } from 'styled-components';

const white = '#FFFFFF';
const grey = '#F4F3F8';
const purple = '#754CFF';
const normalText = '#6D6489';
const darkText = '#2A1B5B';

const light = {
  text: {
    color: {
      normal: normalText,
      dark: darkText,
    },
    weight: {
      normal: 400,
      bold: 600,
    },
  },
  button: {
    background: {
      default: purple,
      disabled: grey,
      gradient: 'linear-gradient(90deg, #6D5CFF 5.4%, #E86EFF 55.92%, #FFD66E 92.38%)',
    },
    text: {
      color: {
        default: white,
        disabled: darkText,
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
  tab: {
    background: {
      default: white,
      active: grey,
    },
  },
  networkLabel: {
    background: white,
  },
  background: grey,
};

export default ({ children }) => (
  <ThemeProvider theme={light}>
    {children}
  </ThemeProvider>
);
