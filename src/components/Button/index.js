import React from 'react';
import styled from 'styled-components';

export default props => (
  <Button {...props} />
);

const Button = styled.button`
  background: ${props => props.theme.button.background[props.disabled ? 'disabled' : (props.gradient ? 'gradient' : 'default')]};
  color: ${props => props.theme.button.text.color[props.disabled ? 'disabled' : 'default']};
  font-size: ${props => props.theme.button.text.size[props.small ? 'small' : 'default']};
  font-weight: ${props => props.theme.button.text.weight[props.small ? 'small' : 'default']};
  padding: 8px 16px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
`;
