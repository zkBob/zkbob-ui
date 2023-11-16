import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Modal from 'components/Modal';
import Link from 'components/Link';
import WalletConnectors from 'components/WalletConnectors';

import { WalletContext } from 'contexts';

export default ({ isOpen, close, currentPool }) => {
  const { t } = useTranslation();
  const { noWalletInstalled, isMobileTronLink } = useContext(WalletContext);

  const { title, description } = useMemo(() => ({
    title: t(`connectWalletModal.${noWalletInstalled ? 'noWalletTitle' : 'title'}`, { wallet: 'TronLink' }),
    description: isMobileTronLink
      ? t('connectWalletModal.tronlinkMobileDescriptionWithDeposit', { symbol: currentPool?.tokenSymbol })
      : t(
        `connectWalletModal.${noWalletInstalled ? 'noWalletDescriptionWithDeposit' : 'description'}`,
        { symbol: currentPool?.tokenSymbol, wallet: 'TronLink' }
      ),
  }), [t, noWalletInstalled, isMobileTronLink, currentPool]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={title}
    >
      <Text>{description}</Text>
      <WalletConnectors callback={close} />
      {!noWalletInstalled && (
        <Text>
          <Trans
            i18nKey="connectWalletModal.note"
            components={{
              1: <Link href="https://docs.zkbob.com/zkbob-overview/compliance-and-security" />,
            }}
          />
        </Text>
      )}
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
