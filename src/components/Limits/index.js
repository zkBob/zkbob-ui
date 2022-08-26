import React from 'react';
import styled from 'styled-components';

import Card from 'components/Card';
import Tooltip from 'components/Tooltip';

import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import { tokenSymbol } from 'utils/token';
import { formatNumber } from 'utils';

export default ({ limits }) => {
  return (
    <Card title="Limits available" style={{ boxShadow: 'none', marginTop: 15 }}>
      {limits.map(({ name, values }) => (
        <Row key={name}>
          <Name>{name}</Name>
          <InnerRow>
            <Value>{formatNumber(values.available)} {tokenSymbol()}</Value>
            <Tooltip
              content={`out of ${formatNumber(values.total)} ${tokenSymbol()} total`}
              placement="right"
              delay={0}
            >
              <InfoIcon />
            </Tooltip>
          </InnerRow>
        </Row>
      ))}
    </Card>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const Name = styled.span`
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
  font-size: 14px;
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
