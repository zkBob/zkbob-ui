import { createGlobalStyle } from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ContextsProvider from 'contexts';

import Pages from 'pages';
import ThemeProvider from 'providers/ThemeProvider';
import GilroyRegular from 'fonts/Gilroy-Regular.woff';
import GilroyMedium from 'fonts/Gilroy-Medium.woff';

import * as style from '@dicebear/avatars-identicon-sprites';

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
  body {
    background-color: ${props => props.theme.background};
    padding: 14px 40px;
    font-family: 'Gilroy';
  }
  button, input, textarea {
    font-family: 'Gilroy';
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
