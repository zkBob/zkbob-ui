import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Modal from 'components/Modal';

import { tokenSymbol, tokenIcon } from 'utils/token';
import { formatNumber } from 'utils';

export default ({
  isOpen, onClose, onConfirm, title, amount, receiver,
  shielded, isZkAddress, fee, numberOfTxs, type,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={460}
    >
      <Container>
        <DetailsContainer>
          <AmountContainer>
            <TokenIcon src={tokenIcon(shielded)} />
            <Amount>{formatNumber(amount)}{' '}</Amount>
            <TokenSymbol>{tokenSymbol(shielded)}</TokenSymbol>
          </AmountContainer>
          <SmallText>
            send to {isZkAddress ? 'zkBob address' : ''}
          </SmallText>
          <MediumText>{receiver}</MediumText>
          <SmallText>{type} details</SmallText>
          <Row>
            <MediumText>Number of transactions:</MediumText>
            <MediumText>{numberOfTxs}</MediumText>
          </Row>
          <Row>
            <MediumText>Relayer fee:</MediumText>
            <MediumText>{formatNumber(fee)} {tokenSymbol(shielded)}</MediumText>
          </Row>
        </DetailsContainer>
        <Button onClick={onConfirm}>Confirm</Button>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SmallText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  text-align: center;
  margin: 11px 0;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const TokenSymbol = styled.span`
  font-size: 36px;
  white-space: nowrap;
  color: ${props => props.theme.text.color.primary}
`;

const Amount = styled(TokenSymbol)`
  font-weight: ${props => props.theme.text.weight.bold};
  margin-right: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 24px;
  background-color: ${props => props.theme.color.grey};
  border-radius: 12px;
  margin-bottom: 20px;
  overflow-wrap: anywhere;
`;

const MediumText = styled.span`
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.text.color.primary};
  margin-bottom: 5px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: stretch;
`;
