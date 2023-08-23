import React from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Modal from 'components/Modal';
import Link from 'components/Link';
import WalletConnectors from 'components/WalletConnectors';

export default ({ isOpen, close, currentPool }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={close} title={t('connectWalletModal.title')}>
      {currentPool && (
        <Text>
          {t('connectWalletModal.description', { symbol: currentPool.tokenSymbol })}
        </Text>
      )}
      <WalletConnectors callback={close} />
      <Text>
        <Trans
          i18nKey="connectWalletModal.note"
          components={{
            1: <Link href="https://docs.zkbob.com/zkbob-overview/compliance-and-security" />,
          }}
        />
      </Text>
    </Modal>
  );
};

const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  text-align: center;
  line-height: 20px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;
