import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Tooltip from 'components/Tooltip';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

export default ({ children }) => {
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);
  return (
    <CopyToClipboard text={children} onCopy={onCopy}>
      <PrivateAddressContainer>
        <Address>
          {children}
        </Address>
        <Tooltip content="Copied" placement="right" visible={isCopied}>
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </Tooltip>
      </PrivateAddressContainer>
    </CopyToClipboard>
  );
}

const CopyIcon = styled(CopyIconDefault)``;

const PrivateAddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  background: ${props => props.theme.input.background.secondary};
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 60px;
  box-sizing: border-box;
  padding: 0 24px;
  outline: none;
  cursor: pointer;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
  }
  &:hover ${CopyIcon} {
    path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;

const Address = styled.span`
  flex: 1;
  max-width: 100%;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;
