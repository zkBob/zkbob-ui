import { ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";

injectStyle();

export default () =>
  <ToastContainer
    position="bottom-right"
  />
