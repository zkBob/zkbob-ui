import React from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';

export default ({ value, token, onSelect }) => {
  return (
    <Container>
      <Row>
        <Value>
          {value.isZero()
            ? 0
            : ethers.utils.formatUnits(value, token?.decimals || 18)}
        </Value>
        <TokenSymbol>{token?.symbol}</TokenSymbol>
      </Row>
      <Select onClick={onSelect}>
        <ItemIcon src={token?.logoURI} />
        <DropdownIcon />
      </Select>
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

const Container = styled(Row)`
  justify-content: space-between;
  height: 60px;
  background: ${props => props.theme.input.background.primary};
  border-radius: 16px;
  padding: 0px 24px;
  transition : border-color 100ms ease-out;
  &:focus-within {
    border-color: ${props => props.theme.input.border.color.focus};
  }
  margin-bottom: 13px;
`;

const TokenSymbol = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.transferInput.text.weight.default};
  margin-left: 8px;
  white-space: nowrap;
`;

const Value = styled(TokenSymbol)`
  margin: 0;
  font-size: 24px;
  color: ${props => props.theme.transferInput.text.color[!!props.children ? 'default' : 'placeholder']};
  min-width: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Select = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-left: 15px;
`;

const DropdownIcon = styled(DropdownIconDefault)`
  margin-left: 4px;
  margin-top: 1px;
`;
