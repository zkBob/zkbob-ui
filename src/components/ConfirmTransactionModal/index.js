import React, { useCallback } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Modal from 'components/Modal';

import daiIcon from 'assets/dai.svg';
import zpDaiIcon from 'assets/zp-dai.svg';

export default ({ isOpen, onClose, onConfirm, title, amount, receiver, isPoolToken, isZkAddress }) => {
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
            <TokenIcon src={isPoolToken ? zpDaiIcon : daiIcon} />
            <Amount>{amount}{' '}</Amount>
            <TokenSymbol>{isPoolToken ? 'shDAI' : 'DAI'}</TokenSymbol>
          </AmountContainer>
          <SmallText>
            send to {isZkAddress ? 'zkBob address' : ''}
          </SmallText>
          <Receiver>{receiver}</Receiver>
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
  margin: 8px 0 11px;
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
  padding: 20px 24px 14px;
  background-color: ${props => props.theme.color.grey};
  border-radius: 12px;
  margin-bottom: 20px;
  overflow-wrap: anywhere;
`;

const Receiver = styled.span`
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.text.color.primary}
`;
