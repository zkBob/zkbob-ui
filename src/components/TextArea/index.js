import React from 'react';
import styled from 'styled-components';

export default props => (
  <TextArea {...props} />
);

const TextArea = styled.textarea`
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  background: ${props => props.theme.input.background[props.secondary ? 'secondary' : 'primary']};
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 120px;
  padding: 16px;
  outline: none;
  resize: none;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
  }
`;
