import React, { useContext, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation, Trans } from 'react-i18next';

import Modal from 'components/Modal';
import Tooltip from 'components/Tooltip';
import Link from 'components/Link';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

import { ModalContext, ZkAccountContext, PoolContext } from 'contexts';

export default () => {
  const { t } = useTranslation();
  const { currentPool } = useContext(PoolContext);
  const { isPaymentLinkModalOpen, closePaymentLinkModal } = useContext(ModalContext);
  const { generateAddress } = useContext(ZkAccountContext);

  const [address, setAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const link = `${window.location.origin}/#/payment/${address}`;

  useEffect(() => {
    async function updateAddress() {
      const address = await generateAddress();
      setAddress(address);
    }
    updateAddress();
  }, [generateAddress, currentPool]);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  return (
    <Modal
      isOpen={isPaymentLinkModalOpen}
      onClose={closePaymentLinkModal}
      title={t('paymentLinkModal.title')}
    >
      <Container>
        <Description>
          <Trans i18nKey="paymentLinkModal.description" values={{ symbol: currentPool.tokenSymbol }} />
        </Description>
        <InputLabel>{t('paymentLinkModal.copyAndShare')}</InputLabel>
        <CopyToClipboard text={link} onCopy={onCopy}>
          <PaymentLinkContainer>
            <LinkText>
              {link}
            </LinkText>
            <Tooltip content={t('common.copied')} placement="right" visible={isCopied}>
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Tooltip>
          </PaymentLinkContainer>
        </CopyToClipboard>
        <Link href="https://docs.zkbob.com/zkbob-overview/readme" size={16}>
          {t('paymentLinkModal.getMoreInfo')}
        </Link>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Description = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 24px;
  text-align: center;
  & > b, & > strong {
    font-weight: ${({ theme }) => theme.text.weight.bold};
  }
`;

const CopyIcon = styled(CopyIconDefault)``;

const PaymentLinkContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  background: ${props => props.theme.input.background.secondary};
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 60px;
  box-sizing: border-box;
  padding: 0 24px;
  outline: none;
  cursor: pointer;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
  }
  &:hover ${CopyIcon} {
    path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;

const LinkText = styled.span`
  flex: 1;
  max-width: 100%;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  white-space: nowrap;
`;

const InputLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  margin-bottom: 10px;
  margin-top: 10px;
`;
