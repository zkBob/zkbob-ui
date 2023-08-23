import React, { useCallback, useState, useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import OptionButtonDefault from 'components/OptionButton';

import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';
import { ReactComponent as CheckIcon } from 'assets/check-stroke.svg';

import { NETWORKS, TOKENS_ICONS } from 'constants';

import config from 'config';

import { ZkAccountContext, ModalContext, PoolContext } from 'contexts';

const chainIds = Object.keys(config.chains).map(chainId => Number(chainId));
const poolsWithAliases = Object.values(config.pools).map((pool, index) => ({
  ...pool,
  alias: Object.keys(config.pools)[index],
}));
const poolsByChainId = chainIds.map(chainId => {
  return {
    chainId,
    pools: Object.values(poolsWithAliases).filter(pool => pool.chainId === chainId),
  };
});

const Content = ({ switchToPool, currentPool, close }) => {
  const { t } = useTranslation();
  const [openedChainId, setOpenedChainId] = useState(currentPool.chainId);

  const showPools = useCallback(chainId => {
    if (openedChainId === chainId) {
      setOpenedChainId(null);
    } else {
      setOpenedChainId(chainId);
    }
  }, [openedChainId]);

  const onSwitchPool = useCallback(poolId => {
    close();
    switchToPool(poolId);
  }, [switchToPool, close]);

  return (
    <Container>
      <Title>{t('networks.title')}</Title>
      {poolsByChainId.map(({ chainId, pools }, index) =>
        <React.Fragment key={index}>
          <OptionButton
            onClick={() => showPools(chainId)}
            className={openedChainId === chainId ? 'active' : ''}
          >
            <RowSpaceBetween>
              <Row>
                <NetworkIcon src={NETWORKS[chainId].icon} />
                {NETWORKS[chainId].name}
              </Row>
              <Row>
                {pools.length}
                {openedChainId === chainId ? (
                  <DropdownIcon />
                ) : (
                  <DropdownIcon style={{ transform: 'rotate(270deg)' }} />
                )}
              </Row>
            </RowSpaceBetween>
          </OptionButton>
          {openedChainId === chainId && (
            <TokensContainer>
              {pools.map((pool, index) =>
                <OptionButtonSmall
                  key={index}
                  onClick={() => onSwitchPool(pool.alias)}
                  className={currentPool.alias === pool.alias ? 'active' : ''}
                  data-ga-id={`pool-${pool.alias.toLowerCase()}`}
                >
                  <RowSpaceBetween>
                    <Row>
                      <TokenIcon src={TOKENS_ICONS[pool.tokenSymbol]} />
                      {pool.tokenSymbol}
                    </Row>
                    {currentPool.alias === pool.alias && <CheckIcon />}
                  </RowSpaceBetween>
                </OptionButtonSmall>
              )}
            </TokensContainer>
          )}
        </React.Fragment>
      )}
    </Container>
  );
};

export default ({ children }) => {
  const { isPoolSwitching, isLoadingState, switchToPool } = useContext(ZkAccountContext);
  const { isNetworkDropdownOpen, openNetworkDropdown, closeNetworkDropdown } = useContext(ModalContext);
  const { currentPool } = useContext(PoolContext);
  return (
    <Dropdown
      width={288}
      placement="bottomLeft"
      disabled={isPoolSwitching || isLoadingState}
      isOpen={isNetworkDropdownOpen}
      open={openNetworkDropdown}
      close={closeNetworkDropdown}
      content={() => (
        <Content
          switchToPool={switchToPool}
          currentPool={currentPool}
          close={closeNetworkDropdown}
        />
      )}
    >
      {children}
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

const RowSpaceBetween = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin-bottom: 20px;
`;

const NetworkIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const TokenIcon = styled(NetworkIcon)`
  margin-right: 4px;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: -10px;
  &:last-child > :last-child {
    margin-bottom: 0;
  }
`;

const OptionButton = styled(OptionButtonDefault)`
  padding: 0 12px;
  font-weight: ${props => props.theme.text.weight.bold};
  &.active {
    background-color: ${props => props.theme.walletConnectorOption.background[props.disabled ? 'default' : 'hover']};
    border: 1px solid ${props => props.theme.walletConnectorOption.border[props.disabled ? 'default' : 'hover']};
  }
`;

const OptionButtonSmall = styled(OptionButton)`
  flex: 0 0 calc(50% - 2px);
  height: 40px;
  border: 0;
  &:hover {
    border: 0;
  }
  &.active {
    background-color: ${props => props.theme.walletConnectorOption.background[props.disabled ? 'default' : 'hover']};
    border: 0;
  }
  &:nth-child(odd) {
    margin-right: 2px;
  }
  &:nth-child(even) {
    margin-left: 2px;
  }
`;

const DropdownIcon = styled(DropdownIconDefault)`
  margin-left: 10px;
`;
