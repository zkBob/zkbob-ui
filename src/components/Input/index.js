import React from 'react';
import styled from 'styled-components';

import Tooltip from 'components/Tooltip';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

export default props => (
  <Container>
    <Input {...props} />
    {props.hint && (
      <Tooltip content={props.hint} placement="right" delay={0} width={180}>
        <InfoIcon />
      </Tooltip>
    )}
  </Container>
);

const Container = styled.div`
  display: flex;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.input.border.color[props.error ? 'error' : 'default']};
  border-radius: 16px;
  background: ${props => props.theme.input.background.secondary};
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 60px;
  padding: 0 24px;
  padding-right: ${props => props.hint ? '50px' : '24px'};
  outline: none;
  transition : border-color 100ms ease-out;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
    opacity: 0.6;
  }
  &:focus {
    border-color: ${props => props.theme.input.border.color[props.error ? 'error' : 'focus']};
  }
`;

const InfoIcon = styled(InfoIconDefault)`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
