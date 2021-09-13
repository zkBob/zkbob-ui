import React from 'react';
import styled from 'styled-components';

import Select from 'components/TransferInput/Select';
import Button from 'components/Button';

export default ({ tokens, selectedToken, onTokenSelect }) => {
  return (
    <Container>
      <Row>
        <Input value="0" />
        <Select {...{ tokens, selectedToken, onTokenSelect }} />
      </Row>
      <Row>
        <SmallText>$1,195</SmallText>
        <Row>
          <SmallText>
            Pool Balance: 1 shETH
          </SmallText>
          <MaxButton type="link">Max</MaxButton>
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
  color: ${props => props.theme.transferInput.text.color.default};
  font-weight: ${props => props.theme.transferInput.text.weight.default};
  width: 100px;
  flex: 1;
  outline: none;
`;

const SmallText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.transferInput.text.color.small};
  font-weight: ${props => props.theme.transferInput.text.weight.small};
  line-height: 20px;
`;

const MaxButton = styled(Button)`
  margin-left: 4px;
`;
