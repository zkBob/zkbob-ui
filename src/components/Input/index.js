import React from 'react';
import styled from 'styled-components';

export default props => (
  <Input {...props} />
);

const Input = styled.input`
  border: 1px solid ${props => props.theme.input.border};
  border-radius: 16px;
  background: ${props => props.theme.input.background[props.secondary ? 'secondary' : 'primary']};
  font-size: 36px;
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 60px;
  padding: 0 24px;
  outline: none;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
  }
`;
