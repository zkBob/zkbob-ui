import { createGlobalStyle } from 'styled-components';

import ContextsProvider from 'contexts';

import ThemeProvider from 'providers/ThemeProvider';
import Web3Provider from 'providers/Web3Provider';

import Pages from 'pages';

import 'services';

import GilroyRegular from 'fonts/Gilroy-Regular.woff';
import GilroyMedium from 'fonts/Gilroy-Medium.woff';
import GilroyBold from 'fonts/Gilroy-Bold.woff';
import GilroyExtraBold from 'fonts/Gilroy-ExtraBold.woff';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyRegular}) format('woff');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyMedium}) format('woff');
    font-weight: 500 600;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyBold}) format('woff');
    font-weight: 700;
  }
  @font-face {
    font-family: 'Gilroy';
    src: url(${GilroyExtraBold}) format('woff');
    font-weight: 800;
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
    display: flex;
    flex-direction: column;
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

export default () => (
  <ThemeProvider>
    <GlobalStyle />
    <Web3Provider>
      <ContextsProvider>
        <Pages />
      </ContextsProvider>
    </Web3Provider>
  </ThemeProvider>
);
