import React, { useRef } from 'react';
import styled from 'styled-components';

import Tooltip from 'components/Tooltip';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import useAutosizeTextArea from './hooks/useAutosizeTextArea';

export default ({ value, onChange, hint, placeholder }) => {
  const textAreaRef = useRef(null);
  useAutosizeTextArea(textAreaRef.current, value);
  return (
    <Container hint={hint} onClick={() => textAreaRef.current.focus()}>
      <TextArea
        ref={textAreaRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        spellCheck={false}
        rows={1}
      />
      {hint &&
        <Tooltip content={hint} placement="right" delay={0} width={180}>
          <InfoIcon />
        </Tooltip>
      }
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  background: ${props => props.theme.input.background.secondary};
  box-sizing: border-box;
  height: 60px;
  padding: 0 24px;
  padding-right: ${props => props.hint ? '50px' : '24px'};
  outline: none;
  cursor: text;
  overflow: hidden;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
    opacity: 0.6;
  }
  &:focus-within {
    border-color: ${props => props.theme.input.border.color[props.error ? 'error' : 'focus']};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  resize: none;
  padding: 0;
  max-height: 40px;
  margin-top: 1px;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
    opacity: 0.6;
  }
`;

const InfoIcon = styled(InfoIconDefault)`
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  cursor: default;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
