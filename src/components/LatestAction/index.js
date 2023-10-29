import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { HistoryTransactionType } from 'zkbob-client-js';
import { useTranslation } from 'react-i18next';

import Link from 'components/Link';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';

import { shortAddress, formatNumber } from 'utils';
import { NETWORKS, TOKENS_ICONS } from 'constants';

export default ({ type, data, currentPool }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const tokenSymbol = useMemo(() => {
    if (data.timestamp <= currentPool.migration?.timestamp) {
      return currentPool.migration?.prevTokenSymbol;
    }
    const isWrapped = currentPool.isNative && data.type === HistoryTransactionType.Deposit;
    return (isWrapped ? 'W' : '') + currentPool.tokenSymbol;
  }, [currentPool, data.type, data.timestamp]);

  return (
    <Row>
      <InnerRow>
        <Action>{t(`latestAction.${type}`)}:</Action>
        <TokenIcon src={TOKENS_ICONS[tokenSymbol]} />
        <Amount>
          {(() => {
            const total = data.actions.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero);
            return (
              <Tooltip content={formatNumber(total, currentPool.tokenDecimals, 18)} placement="top">
                <span>{formatNumber(total, currentPool.tokenDecimals, 2)}</span>
              </Tooltip>
            );
          })()}
          {' '}{tokenSymbol}
        </Amount>
        <TxLink size={16} href={NETWORKS[currentPool.chainId].blockExplorerUrls.tx.replace('%s', data.txHash)}>
          {shortAddress(data.txHash)}
        </TxLink>
      </InnerRow>
      <HistoryButton
        type="link"
        onClick={() => history.push('/history' + location.search)}
      >
        {t('latestAction.viewHistory')}
      </HistoryButton>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 480px;
  max-width: 100%;
  padding: 0 12px;
  margin-top: 25px;
  box-sizing: border-box;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const Action = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  margin-right: 8px;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const Amount = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  margin-right: 16px;
`;

const HistoryButton = styled(Button)`
  justify-self: flex-end;
`;

const TxLink = styled(Link)`
  @media only screen and (max-width: 500px) {
    display: none;
  }
`;
