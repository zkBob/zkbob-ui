import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

export default ({ tabs, activeTab, onTabClick, showBadge }) => {
  const { t } = useTranslation();
  return (
    <Tabs>
      {tabs.map((tab, index) =>
        <Tab
          key={index}
          active={activeTab === index}
          onClick={() => onTabClick(index)}
          $showBadge={showBadge && tab.badge}
          data-ga-id={`tab-${tab.name.toLowerCase()}`}
        >{t(tab.i18nKey)}</Tab>
      )}
    </Tabs>
  );
}

const Tabs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background-color: ${props => props.theme.tab.background.default};
  border-radius: 16px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  & > * {
    flex: 1;
  }
  @media only screen and (max-width: 400px) {
    width: 100%;
  }
  @media only screen and (max-width: 560px) {
    margin-bottom: 20px;
  }
`;

const Tab = styled.div`
  position: relative;
  border-radius: 10px;
  padding: 8px 16px;
  background-color: ${props => props.theme.tab.background[props.active ? 'active' : 'default']};
  color: ${props => props.theme.text.color[props.active ? 'primary' : 'secondary']};
  font-weight: ${props => props.theme.text.weight.bold};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.text.color.primary};
  }
  @media only screen and (max-width: 400px) {
    padding: 8px 10px;
    text-align: center;
  }
  &::after {
    content: '';
    display: ${props => props.$showBadge ? 'block' : 'none'};
    position: absolute;
    top: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #E53E3E;
`;
