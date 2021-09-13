import React from 'react';
import styled from 'styled-components';

export default props => {
  switch(props.type) {
    case 'link':
      return <TransparentButton {...props} />;
    case 'pripary':
    default:
      return <Button {...props} />;
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
  border: 0;
  cursor: pointer;
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
