import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import WalletConnectors from 'components/WalletConnectors';

export default ({ next, isCreation }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Description>
        {isCreation
          ? t('accountSetupModal.createWithWallet.description')
          : t('accountSetupModal.restoreWithWallet.description')
        }
      </Description>
      <WalletConnectors
        callback={next}
        gaIdPrefix={(isCreation ? 'signup-' : 'login-')}
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
