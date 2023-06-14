import React from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import Link from 'components/Link';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';

import { shortAddress, formatNumber } from 'utils';
import { tokenIcon } from 'utils/token';
import { NETWORKS } from 'constants';

export default ({ type, shielded, actions, txHash, currentPool }) => {
  const history = useHistory();
  const location = useLocation();
  return (
    <Row>
      <InnerRow>
        <Action>Latest {type}:</Action>
        <TokenIcon src={tokenIcon(shielded)} />
        <Amount>
          {(() => {
            const total = actions.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero);
            return (
              <Tooltip content={formatNumber(total, 18)} placement="top">
                <span>{formatNumber(total, 2)}</span>
              </Tooltip>
            );
          })()}
          {' '}{currentPool.tokenSymbol}
        </Amount>
        <TxLink size={16} href={NETWORKS[currentPool.chainId].blockExplorerUrls.tx.replace('%s', txHash)}>
          {shortAddress(txHash)}
        </TxLink>
      </InnerRow>
      <HistoryButton
        type="link"
        onClick={() => history.push('/history' + location.search)}
      >
        View History
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
