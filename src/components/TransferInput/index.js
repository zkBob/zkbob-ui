import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import Select from 'components/TransferInput/Select';
import Button from 'components/Button';

import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

export default ({ amount, setAmount, balance, isPoolToken }) => {
  const handleAmountChange = useCallback(value => {
    setAmount(value);
  }, [setAmount]);
  return (
    <Container>
      <Row>
        <Input value={amount} onChange={e => handleAmountChange(e.target.value)} />
        {/* <Select {...{ tokens, selectedToken, onTokenSelect }} /> */}
        <TokenContainer>
          <TokenIcon src={isPoolToken ? zpDaiIcon : daiIcon} />
          {isPoolToken ? 'shDAI' : 'DAI'}
        </TokenContainer>
      </Row>
      <Row>
        {/* <SmallText>$1,195</SmallText> */}
        <div></div>
        <Row>
          {isPoolToken ? (
            <SmallText>
              Pool Balance: {balance} shDAI
            </SmallText>
          ) : (
            <SmallText>
              Balance: {balance} DAI
            </SmallText>
          )}
          <MaxButton type="link" onClick={() => handleAmountChange(balance)}>Max</MaxButton>
        </Row>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  height: 100px;
  background: ${props => props.theme.input.background.primary};
  border: 1px solid ${props => props.theme.input.border};
  border-radius: 16px;
  padding: 0px 24px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Input = styled.input`
  border: 0;
  background: transparent;
  font-size: 36px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.transferInput.text.weight.default};
  width: 100px;
  flex: 1;
  outline: none;
`;

const SmallText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.transferInput.text.weight.small};
  line-height: 20px;
`;

const BigText = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.transferInput.text.weight.small};
  line-height: 45px;
`;

const MaxButton = styled(Button)`
  margin-left: 4px;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`;
