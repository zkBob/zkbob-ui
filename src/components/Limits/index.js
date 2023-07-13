import React from 'react';
import styled from 'styled-components';

import Tooltip from 'components/Tooltip';
import Skeleton from 'components/Skeleton';

import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import { formatNumber } from 'utils';

const Limit = ({ value, loading, currentPool }) => {
  if (!value || loading) {
    return <Skeleton width={80} />
  }
  return !!value.total ? (
    <>
      <Value>{formatNumber(value.available, currentPool.tokenDecimals)} {currentPool.tokenSymbol}</Value>
      <Tooltip
        content={`out of ${formatNumber(value.total, currentPool.tokenDecimals)} ${currentPool.tokenSymbol} total`}
        placement="right"
        delay={0}
      >
        <InfoIcon />
      </Tooltip>
    </>
  ) : (
    <Value style={{ marginRight: 23 }}>
      {formatNumber(value, currentPool.tokenDecimals)} {currentPool.tokenSymbol}
    </Value>
  );
}

export default ({ limits, loading, currentPool }) => {
  return (
    <Container>
      {limits.map(({ prefix, suffix, value }, index) => (
        <Row key={index}>
          <Name>
            {prefix}{' '}
            <NameSuffix>{suffix}</NameSuffix>
          </Name>
          <Limit value={value} loading={loading} currentPool={currentPool} />
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
  max-width: 100%;
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
  line-height: 18px;
`;

const Name = styled.span`
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  font-size: 14px;
  flex: 1;
`;

const NameSuffix = styled(Name)`
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
