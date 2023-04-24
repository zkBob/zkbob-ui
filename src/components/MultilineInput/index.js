import React, { useRef, useCallback } from 'react';
import styled from 'styled-components';

import Tooltip from 'components/Tooltip';
import QRCodeReader from 'components/QRCodeReader';

import { ReactComponent as InfoIconDefault } from 'assets/info.svg';
import { ReactComponent as QrCodeIconDefault } from 'assets/qr-code.svg';

import useAutosizeTextArea from './hooks/useAutosizeTextArea';

export default ({ value, onChange, hint, placeholder, qrCode }) => {
  const textAreaRef = useRef(null);
  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = useCallback(e => {
    onChange(e.target.value);
  }, [onChange])

  const handleKeyPress = event => {
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
    }
  };

  return (
    <Container hint={hint} onClick={() => textAreaRef.current.focus()}>
      <TextArea
        ref={textAreaRef}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        spellCheck={false}
        rows={1}
      />
      {(hint && !qrCode) &&
        <Tooltip content={hint} placement="right" delay={0} width={180}>
          <InfoIcon />
        </Tooltip>
      }
      {qrCode && (
        <QRCodeReader onResult={onChange}>
          <QrCodeIcon />
        </QRCodeReader>
      )}
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
  min-height: 60px;
  max-height: 60px;
  padding: 9px 24px;
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
  @media only screen and (max-width: 500px) {
    max-height: 80px;
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
  max-height: 40px;
  resize: none;
  padding: 0;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
    opacity: 0.6;
  }
  @media only screen and (max-width: 500px) {
    max-height: 60px;
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

const QrCodeIcon = styled(QrCodeIconDefault)`
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;
