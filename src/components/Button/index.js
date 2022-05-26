import React from 'react';
import styled from 'styled-components';

import SpinnerDefault from 'components/Spinner';

export default props => {
  switch(props.type) {
    case 'link':
      return <TransparentButton {...props} />;
    case 'pripary':
    default:
      return (
        <Button {...props}>
          {props.$loading && <Spinner {...props} size={props.$small ? 16 : 24} />}
          {props.children}
        </Button>
      );
  }
};

const Button = styled.button`
  background: ${props =>
    props.theme.button.primary.background[props.disabled ? (props.$contrast ? 'contrast' : 'disabled') : 'default']
  };
  color: ${props => props.theme.button.primary.text.color[props.$contrast ? 'contrast' : 'default']};
  font-size: ${props => props.theme.button.primary.text.size[props.$small ? 'small' : 'default']};
  font-weight: ${props => props.theme.button.primary.text.weight[props.$small ? 'small' : 'default']};
  padding: ${props => props.$small ? '8px 16px' : '0'};
  height: ${props => props.$small ? '30px' : '60px'};
  box-sizing: border-box;
  border-radius: 16px;
  border: 0;
  border-color: ${props => props.theme.button.primary.border.color};
  border-style: solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransparentButton = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: ${props => props.theme.button.link.text.color};
`;

const Spinner = styled(SpinnerDefault)`
  margin-right: ${props => props.$small ? '5px' : '8px'};
  path {
    stroke: ${props => props.theme.button.primary.text.color[props.$contrast ? 'contrast' : 'default']};
    stroke-width: 6;
  }
`;
