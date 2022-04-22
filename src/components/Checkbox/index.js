import React from 'react';
import styled from 'styled-components';

import checkIcon from 'assets/check.svg';

export default props => (
  <Row>
    <Input type="checkbox" name="checkbox" id={`checkbox-${props.label}`} {...props} />
    <Label htmlFor={`checkbox-${props.label}`}>{props.label}</Label>
  </Row>

);

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 6px;
  background: ${props => props.theme.input.background.primary};
  width: 20px;
  height: 20px;
  outline: none;
  margin-right: 8px;
  &:checked {
    border: none;
    background: ${props => props.theme.input.background.checked};
    background-image: url(${checkIcon});
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.color.secondary};
`;
