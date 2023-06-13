import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import Switch from 'components/Switch';

import { tokenSymbol } from 'utils/token';
import { formatNumber } from 'utils';

const options = ['1', '5', '10'].map(ethers.utils.parseEther);

export default ({ amountToConvert, setAmountToConvert, amountToWithdraw, maxAmountToWithdraw, details }) => {
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (!isConverting) {
      setAmountToConvert(ethers.constants.Zero);
    }
  }, [isConverting, setAmountToConvert]);

  useEffect(() => {
    if (amountToConvert.gt(amountToWithdraw) || amountToConvert.gt(maxAmountToWithdraw)) {
      setAmountToConvert(ethers.constants.Zero);
    }
  }, [amountToConvert, amountToWithdraw, maxAmountToWithdraw, setAmountToConvert]);

  return (
    <Column>
      <Row>
        <Text style={{ marginRight: 8 }}>
          Convert some BOB to {details.toTokenSymbol} on withdrawal
        </Text>
        <Switch checked={isConverting} onChange={setIsConverting} />
      </Row>
      {isConverting && (
        <Row>
          {options.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => setAmountToConvert(option)}
              active={amountToConvert.eq(option)}
              disabled={option.gt(amountToWithdraw) || option.gt(maxAmountToWithdraw)}
            >
              <TextBold>{formatNumber(option)} {tokenSymbol()}</TextBold>
              <Text>
                ~{' '}
                {formatNumber(option.mul(details.price).div(ethers.utils.parseUnits('1', details.decimals)))}{' '}
                {details.toTokenSymbol}
              </Text>
            </OptionButton>
          ))}
        </Row>
      )}
    </Column>
  )
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.primary};
  line-height: 20px;
  text-align: center;
`;

const TextBold = styled(Text)`
  font-weight: ${props => props.theme.text.weight.bold};
`;

const OptionButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.walletConnectorOption.background[props.active ? 'hover' : 'default']};
  border: 1px solid ${props => props.theme.walletConnectorOption.border[props.active ? 'hover' : 'light']};
  border-radius: 16px;
  height: 50px;
  padding: 0 10px;
  cursor: pointer;
  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
  @media only screen and (max-width: 500px) {
    ${Text} {
      font-size: 13px;
    }
    ${TextBold} {
      font-size: 14px;
    }
  }
`;
