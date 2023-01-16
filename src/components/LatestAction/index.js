import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';

import Link from 'components/Link';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';

import { shortAddress, formatNumber } from 'utils';
import { tokenSymbol, tokenIcon } from 'utils/token';

export default ({ type, shielded, actions, txHash }) => {
  const history = useHistory();
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
          {' '}{tokenSymbol(shielded)}
        </Amount>
        <TxLink size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', txHash)}>
          {shortAddress(txHash)}
        </TxLink>
      </InnerRow>
      <HistoryButton
        type="link"
        onClick={() => history.push('/history')}
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
