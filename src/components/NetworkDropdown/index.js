import { useCallback } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import OptionButton from 'components/OptionButton';

import { NETWORKS } from 'constants';

import config from 'config';


const Content = ({ switchToPool, currentPool, buttonRef }) => {
  const onSwitchPool = useCallback(poolId => {
    buttonRef.current.click();
    switchToPool(poolId);
  }, [switchToPool, buttonRef]);

  return (
    <Container>
      <Title>Networks</Title>
      {Object.values(config.pools).map((pool, index) =>
        <OptionButton
          key={index}
          onClick={() => onSwitchPool(Object.keys(config.pools)[index])}
          disabled={currentPool === Object.keys(config.pools)[index]}
        >
          <Row>
            <NetworkIcon src={NETWORKS[pool.chainId].icon} />
            {NETWORKS[pool.chainId].name}
          </Row>
        </OptionButton>
      )}
    </Container>
  );
};

export default ({ disabled, switchToPool, currentPool, buttonRef, children }) => (
  <Dropdown
    disabled={disabled}
    content={() => (
      <Content switchToPool={switchToPool} currentPool={currentPool} buttonRef={buttonRef} />
    )}
  >
    {children}
  </Dropdown>
);

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

const Title = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin-bottom: 20px;
`;

const NetworkIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 10px;
`;
