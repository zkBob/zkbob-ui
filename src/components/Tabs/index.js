import React from 'react';
import styled from 'styled-components';

export default ({ tabs, activeTab, onTabClick }) => {
  return (
    <Tabs>
      {tabs.map((tab, index) =>
        <Tab
          key={index}
          active={activeTab === index}
          onClick={() => onTabClick(index)}
        >{tab}</Tab>
      )}
    </Tabs>
  );
}

const Tabs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 70px;
  background-color: ${props => props.theme.tab.background.default};
  border-radius: 16px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  & > * {
    flex: 1;
  }
`;

const Tab = styled.div`
  border-radius: 10px;
  padding: 8px 16px;
  background-color: ${props => props.theme.tab.background[props.active ? 'active' : 'default']};
  color: ${props => props.theme.text.color[props.active ? 'primary' : 'secondary']};
  font-weight: ${props => props.theme.text.weight.bold};
  cursor: pointer;
`;
