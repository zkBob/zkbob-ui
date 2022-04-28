import React from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

import Link from 'components/Link';
import Button from 'components/Button';

import { shortAddress, formatNumber } from 'utils';

import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

export default ({ type, isPoolToken, amount, txHash }) => {
  const history = useHistory();
  return (
    <Row>
      <InnerRow>
        <Action>Latest {type}:</Action>
        <TokenIcon src={isPoolToken ? zpDaiIcon : daiIcon} />
        <Amount>
          {formatNumber(ethers.utils.formatUnits(amount, 9))} {isPoolToken ? 'shDAI' : 'DAI'}
        </Amount>
        <Link size={16} href={process.env.REACT_APP_EXPLORER_TX_TEMPLATE.replace('%s', txHash)}>
          {shortAddress(txHash)}
        </Link>
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
  width: 456px;
  margin-top: 25px;
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
