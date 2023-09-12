import React from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Button from 'components/Button';
import Link from 'components/Link';
import Modal from 'components/Modal';

const DOCS_URL = 'https://www.binance.com/en/support/faq/how-to-mint-binance-account-bound-bab-token-bacaf9595b52440ea2b023195ba4a09c';

export default ({ isOpen, onClose, account, isWalletModalOpen, openWalletModal, currentPool }) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('increasedLimitsModal.title')}
      containerStyle={{ visibility: isWalletModalOpen ? 'hidden' : 'visible' }}
    >
      <Container>
        <Text>
          <Trans
            i18nKey="increasedLimitsModal.paragraph1"
            components={{ 1: <Link href={DOCS_URL} /> }}
          />
          <br /><br />
          {t('increasedLimitsModal.paragraph2')}
          <List>
            <li>
              {t('increasedLimitsModal.step1')}
            </li>
            <li>
              {t('increasedLimitsModal.step2')}
            </li>
          </List>
          <br />
          {t('increasedLimitsModal.paragraph3')}
        </Text>
        {account ? (
          <LinkButton
            href={currentPool.kycUrls?.homepage.replace('%s', account)}
            data-ga-id="kyc-banner-verify-bab"
          >
            {t('increasedLimitsModal.button')}
          </LinkButton>
        ) : (
          <Button onClick={openWalletModal} data-ga-id="kyc-banner-connect-wallet">
            {t('buttonText.connectWallet')}
          </Button>
        )}
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px 6px;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 22px;
  margin-bottom: 24px;
`;

const List = styled.ol`
  padding-inline-start: 15px;
  margin: 0;
`;

const LinkButton = styled(Link)`
  background: ${props => props.theme.button.primary.background.default};
  color: ${props => props.theme.button.primary.text.color.default};
  font-size: ${props => props.theme.button.primary.text.size.default};
  font-weight: ${props => props.theme.button.primary.text.weight.default};
  height: 60px;
  box-sizing: border-box;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
