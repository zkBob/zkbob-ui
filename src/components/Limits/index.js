import React from 'react';
import styled from 'styled-components';

import Tooltip from 'components/Tooltip';

import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import { tokenSymbol } from 'utils/token';
import { formatNumber } from 'utils';

export default ({ limits }) => {
  return (
    <Container>
      {limits.map(({ name, values, perAddress }, index) => (
        <Row key={index}>
          <Name>
            {name}{' '}
            <NamePostfix>limit{perAddress && ' per address'}</NamePostfix>
          </Name>
          <Value>{formatNumber(values.available)} {tokenSymbol()}</Value>
          <Tooltip
            content={`out of ${formatNumber(values.total)} ${tokenSymbol()} total`}
            placement="right"
            delay={0}
          >
            <InfoIcon />
          </Tooltip>
        </Row>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(255, 250, 238, 0.6);
  border-radius: 16px;
  margin-top: 20px;
  padding: 12px;
  width: 480px;
  box-sizing: border-box;
  & > * {
    margin-bottom: 6px;
  }
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Name = styled.span`
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  font-size: 14px;
  flex: 1;
`;

const NamePostfix = styled(Name)`
  font-weight: ${props => props.theme.text.weight.normal};
`;

const Value = styled.span`
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  font-size: 14px;
`;

const InfoIcon = styled(InfoIconDefault)`
  margin-left: 5px;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;
