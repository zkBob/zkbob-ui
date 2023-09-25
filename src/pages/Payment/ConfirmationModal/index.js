import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Modal from 'components/Modal';

import { formatNumber, shortAddress } from 'utils';

import { ModalContext } from 'contexts';

export default ({ onConfirm, amount, symbol, tokenAmount, token, receiver, sender, fee }) => {
  const { t } = useTranslation();
  const { isPaymentConfirmationModalOpen, closePaymentConfirmationModal } = useContext(ModalContext);

  return (
    <Modal
      isOpen={isPaymentConfirmationModalOpen}
      onClose={closePaymentConfirmationModal}
      title={t('confirmTransaction.titles.transfer')}
      width={460}
    >
      <Container>
        <DetailsContainer>
          <Amount>{amount} {symbol}</Amount>
          <TokenAmount>
            ≈ {formatNumber(tokenAmount, token?.decimals)} {token?.symbol}
          </TokenAmount>
          <SmallText>
            {t('confirmTransaction.sendToZk')}
          </SmallText>
          <MediumText>{receiver}</MediumText>
          <SmallText>{t(`confirmTransaction.details.transfer`)}</SmallText>
          <Row>
            <MediumText>{t('confirmTransaction.senderAddress')}:</MediumText>
            <MediumText>{shortAddress(sender || '')}</MediumText>
          </Row>
          <Row>
            <MediumText>{t('common.fee')}:</MediumText>
            <MediumText>{fee} {symbol}</MediumText>
          </Row>
        </DetailsContainer>
        <Button
          onClick={onConfirm}
          data-ga-id="confirm-operation"
        >
          {t('buttonText.confirm')}
        </Button>
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

const TokenAmount = styled(MediumText)`
  font-weight: ${props => props.theme.text.weight.bold};
  margin-top: 10px;
`;
