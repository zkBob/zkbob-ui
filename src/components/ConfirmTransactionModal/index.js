import React from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Modal from 'components/Modal';
import Skeleton from 'components/Skeleton';

import { formatNumber } from 'utils';
import { useDisplayedFee } from 'hooks';
import { TOKENS_ICONS } from 'constants';

export default ({
  isOpen, onClose, onConfirm, amount, receiver,
  isZkAddress, fee, numberOfTxs, type, isLoadingFee,
  isMultitransfer, transfers, openDetails, currentPool,
  amountToConvert = ethers.constants.Zero, convertionDetails,
}) => {
  const { t } = useTranslation();
  const displayedFee = useDisplayedFee(currentPool, fee);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(`confirmTransaction.titles.${type}`)}
      width={460}
    >
      <Container>
        <DetailsContainer>
          <AmountContainer>
            <TokenIcon src={TOKENS_ICONS[currentPool.tokenSymbol]} />
            <Amount>
              {formatNumber(
                isMultitransfer
                  ? transfers.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero)
                  : amount.sub(amountToConvert),
                currentPool.tokenDecimals,
                18
              )}{' '}
            </Amount>
            <TokenSymbol>{currentPool.tokenSymbol}</TokenSymbol>
          </AmountContainer>
          {!amountToConvert.isZero() && (
            <ConvertedAmount>
              + {formatNumber(
                  amountToConvert.mul(convertionDetails.price).div(ethers.utils.parseUnits('1', convertionDetails.decimals)),
                  currentPool.tokenDecimals
                )}{' '}
              {convertionDetails.toTokenSymbol}
            </ConvertedAmount>
          )}
          {isMultitransfer ? (
            <>
              <MediumTextMulti>{t('confirmTransaction.sendToMultiple', { count: transfers.length })}</MediumTextMulti>
              <ViewAllButton type="link" onClick={openDetails}>{t('confirmTransaction.viewAll')}</ViewAllButton>
            </>
          ) : (
            <>
              <SmallText>
                {isZkAddress ? t('confirmTransaction.sendToZk') : t('confirmTransaction.sendTo')}
              </SmallText>
              <MediumText>{receiver}</MediumText>
            </>
          )}
          <SmallText>{t(`confirmTransaction.details.${type}`)}</SmallText>
          {!amountToConvert.isZero() && (
            <Row>
              <MediumText>{t('confirmTransaction.withdrawAmount')}:</MediumText>
              <MediumText>{formatNumber(amount, currentPool.tokenDecimals)} {currentPool.tokenSymbol}</MediumText>
            </Row>
          )}
          {numberOfTxs > 1 && (
            <Row>
              <MediumText>{t('confirmTransaction.numberOfTransactions')}:</MediumText>
              <MediumText>{numberOfTxs}</MediumText>
            </Row>
          )}
          <Row>
            <MediumText>{t('common.relayerFee')}:</MediumText>
            {isLoadingFee ? (
              <Skeleton width={60} />
            ) : (
              <MediumText>{displayedFee}</MediumText>
            )}
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

const ViewAllButton = styled(Button)`
  font-size: 16px;
  margin-bottom: 5px;
`;

const MediumTextMulti = styled(MediumText)`
  margin-bottom: 0;
  margin-top: 10px;
`;

const ConvertedAmount = styled(MediumText)`
  font-weight: ${props => props.theme.text.weight.bold};
  margin-top: 10px;
`;
