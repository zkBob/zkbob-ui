import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';

export default ({ tokens, selectedToken, onTokenSelect }) => {
  const [showList, setShowList] = useState(false);
  const toggleSelect = useCallback(() => {
    setShowList(!showList);
  }, [showList]);
  const onSelect = useCallback(index => {
    onTokenSelect(index);
    toggleSelect();
  }, [onTokenSelect, toggleSelect]);
  return (
    <OutsideClickHandler onOutsideClick={() => setShowList(false)} display="flex">
      <Select>
        <SelectedItemContainer onClick={toggleSelect}>
          <ItemIcon src={tokens[selectedToken].icon} />
          {tokens[selectedToken].name}
          <DropdownIcon />
        </SelectedItemContainer>
        {showList &&
          <List>
            {tokens.map(({ name, icon }, index) =>
              <ItemContainer key={name} onClick={() => onSelect(index)} >
                <ItemIcon src={icon} />
                {name}
              </ItemContainer>
            )}
          </List>
        }
      </Select>
    </OutsideClickHandler>
  );
}

const Select = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 7px;
  padding: 10px 15px;
  position: absolute;
  top: 35px;
  left: -15px;
  width: 100%;
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
`;

const ItemContainer = styled(SelectedItemContainer)`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const DropdownIcon = styled(DropdownIconDefault)`
  margin-left: 8px;
  margin-top: 1px;
`;
