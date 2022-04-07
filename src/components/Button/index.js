import React from 'react';
import styled from 'styled-components';

import { ReactComponent as SpinnerIconDefault } from 'assets/spinner.svg';

export default props => {
  switch(props.type) {
    case 'link':
      return <TransparentButton {...props} />;
    case 'pripary':
    default:
      return (
        <Button {...props}>
          {props.loading && <SpinnerIcon small={props.small} />}
          {props.children}
        </Button>
      );
  }
};

const Button = styled.button`
  background: ${props => props.theme.button.primary.background[props.disabled ? 'disabled' : (props.gradient ? 'gradient' : 'default')]};
  color: ${props => props.theme.button.primary.text.color[props.disabled ? 'disabled' : 'default']};
  font-size: ${props => props.theme.button.primary.text.size[props.small ? 'small' : 'default']};
  font-weight: ${props => props.theme.button.primary.text.weight[props.small ? 'small' : 'default']};
  padding: ${props => props.small ? '8px 16px' : '0'};
  height: ${props => props.small ? 'auto' : '60px'};
  border-radius: ${props => props.small ? '10px' : '16px'};
  border: ${props => props.disabled && props.contrast ? '1px' : 0 };
  border-color: ${props => props.theme.button.primary.border.color};
  border-style: solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransparentButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  color: ${props => props.theme.button.link.text.color};
`;

const SpinnerIcon = styled(SpinnerIconDefault)`
  width: ${props => props.small ? '16px' : '24px'};
  height: ${props => props.small ? '16px' : '24px'};
  margin-right: ${props => props.small ? '5px' : '8px'};
  path {
    stroke: ${props => props.theme.button.primary.text.color.disabled};
    stroke-width: 6;
  }
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
