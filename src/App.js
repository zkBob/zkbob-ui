import { createGlobalStyle } from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ContextsProvider from 'contexts';

import Pages from 'pages';
import ThemeProvider from 'providers/ThemeProvider';
import GilroyRegular from 'fonts/Gilroy-Regular.woff';
import GilroyMedium from 'fonts/Gilroy-Medium.woff';
import GilroyBold from 'fonts/Gilroy-Bold.woff';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyRegular}) format('woff');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyMedium}) format('woff');
    font-weight: 600;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyBold}) format('woff');
    font-weight: 700;
  }
  body {
    margin: 0;
    font-family: 'Gilroy';
  }
  button, input, textarea, .Toastify__toast {
    font-family: 'Gilroy';
  }
  #root {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    box-sizing: border-box;
    background-image: ${props => props.theme.background};
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

function getLibrary(provider) {
  return new Web3Provider(provider);
}

export default () => (
  <ThemeProvider>
    <GlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContextsProvider>
        <Pages />
      </ContextsProvider>
    </Web3ReactProvider>
  </ThemeProvider>
);
