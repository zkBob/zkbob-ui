import React, { useCallback } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';

import { tokenSymbol, tokenIcon } from 'utils/token';
import { formatNumber } from 'utils';

export default ({ amount, onChange, balance, fee, shielded, setMax }) => {
  const handleAmountChange = useCallback(value => {
    if (!value || /^\d*(?:[.]\d*)?$/.test(value)) {
      onChange(value);
    }
  }, [onChange]);
  return (
    <Container>
      <Row>
        <Input
          placeholder={0}
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
        />
        <TokenContainer>
          <TokenIcon src={tokenIcon(shielded)} />
          {tokenSymbol(shielded)}
        </TokenContainer>

      </Row>
      <Row>
        <SmallText>
          Relayer fee: {formatNumber(fee)} {tokenSymbol(shielded)}
        </SmallText>
        <Row>
          <SmallText>
            {shielded ? 'Pool balance' : 'Balance'}: {formatNumber(balance)} {tokenSymbol(shielded)}
          </SmallText>
          <MaxButton
            type="link"
            onClick={setMax}
            tabIndex="-1"
          >
            Max
          </MaxButton>
        </Row>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  margin-left: 15px;
`;
