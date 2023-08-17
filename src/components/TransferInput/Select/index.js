import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import OptionButtonDefault from 'components/OptionButton';
import Dropdown from 'components/Dropdown';

import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';

import { TOKENS_ICONS } from 'constants';

import { ModalContext } from 'contexts';

const getTokenSymbol = (tokenSymbol, isNative) => (isNative ? '' : 'W') + tokenSymbol;

const Content = ({ tokenSymbol, isNativeSelected, onTokenSelect, close }) => {
  const onSelect = useCallback(isNative => {
    onTokenSelect(isNative);
    close();
  }, [onTokenSelect, close]);

  return (
    <Container>
      {[true, false].map((isNative, index) =>
        <OptionButton
          key={index}
          onClick={() => onSelect(isNative)}
          className={isNativeSelected === isNative ? 'active' : ''}
        >
          <Row>
            <ItemIcon
              src={TOKENS_ICONS[getTokenSymbol(tokenSymbol, isNative)]}
              style={{ marginRight: 4 }}
            />
            {getTokenSymbol(tokenSymbol, isNative)}
          </Row>
        </OptionButton>
      )}
    </Container>
  );
};

export default ({ tokenSymbol, isNativeSelected, onTokenSelect }) => {
  const { isTokenSelectorOpen, openTokenSelector, closeTokenSelector } = useContext(ModalContext);
  return (
    <Dropdown
      width={120}
      style={{ padding: '12px' }}
      isOpen={isTokenSelectorOpen}
      open={openTokenSelector}
      close={closeTokenSelector}
      fullscreen={false}
      content={() => (
        <Content
          tokenSymbol={tokenSymbol}
          isNativeSelected={isNativeSelected}
          onTokenSelect={onTokenSelect}
          close={closeTokenSelector}
        />
      )}
    >
      <SelectedItemContainer>
        <ItemIcon src={TOKENS_ICONS[getTokenSymbol(tokenSymbol, isNativeSelected)]} />
        {getTokenSymbol(tokenSymbol, isNativeSelected)}
        <DropdownIcon />
      </SelectedItemContainer>
    </Dropdown>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const ItemIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const SelectedItemContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-left: 15px;
`;

const DropdownIcon = styled(DropdownIconDefault)`
  margin-left: 2px;
  margin-top: 1px;
`;

const OptionButton = styled(OptionButtonDefault)`
  height: 48px;
  padding: 0 12px;
  border: 1px solid ${props => props.theme.walletConnectorOption.background.default};
  &.active {
    background-color: ${props => props.theme.walletConnectorOption.background.hover};
    border: 1px solid ${props => props.theme.walletConnectorOption.border.hover};
  }
`;
