import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";

injectStyle();

export default () =>
  <ToastContainerStyled
    position="bottom-right"
    autoClose={10000}
    hideProgressBar
  />

const ToastContainerStyled = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 16px;
    color: ${props => props.theme.text.color.secondary};
    font-size: 14px;
    line-height: 20px;
    cursor: default;
  }
`;
