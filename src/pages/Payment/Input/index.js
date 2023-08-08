import React, { useCallback, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

export default ({ value, onChange }) => {
  const inputRef = useRef();
  const spanRef = useRef();
  const [width, setWidth] = useState(0);

  const handleChange = useCallback(value => {
    if (!value || /^\d*(?:[.]\d*)?$/.test(value)) {
      onChange(value);
    }
  }, [onChange]);

  useEffect(() => {
    setWidth(spanRef.current.offsetWidth);
  }, [value]);

  return (
    <Container onClick={() => inputRef.current.focus()}>
      <HiddenText ref={spanRef}>{value}</HiddenText>
      <Input
        ref={inputRef}
        placeholder={0}
        value={value}
        onChange={e => handleChange(e.target.value)}
        style={{ width }}
      />
      <Currency>USD</Currency>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
  background: ${props => props.theme.input.background.secondary};
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  box-sizing: border-box;
  padding: 0px 24px;
  transition : border-color 100ms ease-out;
  &:focus-within {
    border-color: ${props => props.theme.input.border.color.focus};
  }
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: 0;
  background: transparent;
  font-size: 24px;
  color: ${props => props.theme.transferInput.text.color.default};
  font-weight: ${props => props.theme.transferInput.text.weight.default};
  min-width: 16px;
  outline: none;
  padding: 0;
  z-index: 1;
  &::placeholder {
    color: ${props => props.theme.transferInput.text.color.placeholder};
  }
`;

const Currency = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.transferInput.text.weight.default};
  margin-left: 8px;
`;

const HiddenText = styled.span`
  position: absolute;
  opacity: 0;
  font-size: 24px;
  font-weight: ${props => props.theme.transferInput.text.weight.default};
`;
