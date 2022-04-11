import React from 'react';
import styled from 'styled-components';

import { ReactComponent as SpinnerIconDefault } from 'assets/spinner.svg';

export default props => <SpinnerIcon {...props} />;

const SpinnerIcon = styled(SpinnerIconDefault)`
  align-self: center;
  width: ${props => props.size ? `${props.size}px` : '82px'};
  height: ${props => props.size ? `${props.size}px` : '82px'};
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  @keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  }
`;
