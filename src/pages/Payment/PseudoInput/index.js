import React from 'react';
import styled from 'styled-components';

import Skeleton from 'components/Skeleton';

import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';
import { formatNumber } from 'utils';

export default ({ value, token, onSelect, isLoading, balance, isLoadingBalance }) => {
  return (
    <Container>
      <RowSpaceBetween>
        <Row>
          {isLoading ? (
            <Skeleton width={40} />
          ) : (
            <Value>
              {formatNumber(value, token?.decimals || 18, 6)}
            </Value>
          )}
          <TokenSymbol>{token?.symbol}</TokenSymbol>
        </Row>
        <Select onClick={onSelect}>
          <ItemIcon src={token?.logoURI} />
          <DropdownIcon />
        </Select>
      </RowSpaceBetween>
      <Row>
        <Balance style={{ marginRight: 5 }}>Balance:</Balance>
        {isLoadingBalance ? (
          <Skeleton width={40} />
        ) : (
          <Balance>{formatNumber(balance, token?.decimals || 18)} {token?.symbol}</Balance>
        )}
      </Row>
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

const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 60px;
  background: ${props => props.theme.input.background.primary};
  border-radius: 16px;
  padding: 10px 24px;
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
  color: ${props => props.theme.transferInput.text.color[props.children !== '0' ? 'default' : 'placeholder']};
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

const Balance = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
`;
