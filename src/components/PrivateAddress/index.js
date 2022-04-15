import React from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';

export default ({ children }) => (
  <PrivateAddressContainer>
    <Address>
      {children}
    </Address>
    <CopyToClipboard text={children}>
      <CopyIcon />
    </CopyToClipboard>
  </PrivateAddressContainer>
);

const PrivateAddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid ${props => props.theme.input.border};
  border-radius: 16px;
  background: ${props => props.theme.input.background.secondary};
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 60px;
  box-sizing: border-box;
  padding: 0 24px;
  outline: none;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
  }
`;

const Address = styled.span`
  flex: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyIcon = styled(CopyIconDefault)`
  width: 20px;
  cursor: pointer;
`;
