import { createGlobalStyle } from 'styled-components';

import Pages from 'pages';
import ThemeProvider from 'providers/ThemeProvider';
import GilroyRegular from 'fonts/Gilroy-Regular.woff';
import GilroyMedium from 'fonts/Gilroy-Medium.woff';

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
  button, input {
    font-family: 'Gilroy';
  }
`;

export default () => (
  <ThemeProvider>
    <GlobalStyle />
    <Pages />
  </ThemeProvider>
);
