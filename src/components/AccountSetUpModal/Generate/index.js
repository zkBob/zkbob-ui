import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import WalletConnectors from 'components/WalletConnectors';

import { PoolContext, WalletContext } from 'contexts';

export default ({ next, isCreation }) => {
  const { t } = useTranslation();
  const { currentPool } = useContext(PoolContext);
  const { noWalletInstalled, isMobileTronLink } = useContext(WalletContext);

  let description;
  if (isCreation) {
    description = t('accountSetupModal.createWithWallet.description');
    if (isMobileTronLink) {
      description = t('connectWalletModal.tronlinkMobileDescription');
    } else if (noWalletInstalled) {
      description = t('connectWalletModal.noWalletDescription', { wallet: 'TronLink' });
    }
  } else {
    description = t('accountSetupModal.restoreWithWallet.description');
  }

  return (
    <Container>
      {!isCreation && (
        <Warning>
          {t(`accountSetupModal.restoreWithWallet.warning${currentPool.isTron ? '_tron' : ''}`)}
        </Warning>
      )}
      <Description>
        {description}
      </Description>
      <WalletConnectors
        callback={next}
        gaIdPrefix={(isCreation ? 'signup-' : 'login-')}
        showAll={!isCreation}
      />
    </Container>
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

const Description = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.primary};
  line-height: 20px;
  text-align: center;
`;

const Warning = styled.div`
  background: ${({ theme }) => theme.warning.background};
  border: 1px solid ${({ theme }) => theme.warning.border};
  color: ${({ theme }) => theme.warning.text.color};
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 14px;
  line-height: 20px;
  margin-left: -7px;
  margin-right: -7px;
  text-align: center;
`;
