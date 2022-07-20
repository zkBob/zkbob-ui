import React, { useCallback } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';

import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

export default ({ amount, setAmount, balance, fee, isPoolToken, setMax }) => {
  const handleAmountChange = useCallback(value => {
    if (!value || /^\d*(?:[.]\d*)?$/.test(value)) {
      setAmount(value);
    }
  }, [setAmount]);
  return (
    <Container>
      <Column>
        <Input
          placeholder={0}
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
        />
        <SmallText>
          Relayer fee: {fee} {isPoolToken ? 'shDAI' : 'DAI'}
        </SmallText>
      </Column>
      <ColumnEnd>
        <TokenContainer>
          <TokenIcon src={isPoolToken ? zpDaiIcon : daiIcon} />
          {isPoolToken ? 'shDAI' : 'DAI'}
        </TokenContainer>
        <Row>
          {isPoolToken ? (
            <SmallText>
              Pool balance: {balance} shDAI
            </SmallText>
          ) : (
            <SmallText>
              Balance: {balance} DAI
            </SmallText>
          )}
          <MaxButton
            type="link"
            onClick={setMax}
          >
            Max
          </MaxButton>
        </Row>
      </ColumnEnd>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  background: ${props => props.theme.input.background.secondary};
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  padding: 0px 24px;
  transition : border-color 100ms ease-out;
  &:focus-within {
    border-color: ${props => props.theme.input.border.color.focus};
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ColumnEnd = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Input = styled.input`
  border: 0;
  background: transparent;
  font-size: 36px;
  color: ${props => props.theme.transferInput.text.color.placeholder};
  font-weight: ${props => props.theme.transferInput.text.weight.default};
  width: 100%;
  flex: 1;
  outline: none;
  &::placeholder {
    color: ${props => props.theme.transferInput.text.color.placeholder};
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const SmallText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.transferInput.text.weight.small};
  line-height: 20px;
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
  font-size: 16px;
  padding: 10px 0;
`;
