import React from 'react';
import styled from 'styled-components';

export default props => (
  <Link {...props} target="_blank" rel="noopener noreferrer" />
);

const Link = styled.a`
  background: transparent;
  border: 0;
  padding: 0;
  font-size: ${props => props.size ? `${props.size}px` : '14px'};;
  font-weight: 400;
  cursor: pointer;
  color: ${props => props.theme.button.link.text.color};
  underline: none;
  text-decoration: none;
`;
