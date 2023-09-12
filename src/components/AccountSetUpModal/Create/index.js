import React from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Button from 'components/Button';
import CopyTextButton from 'components/CopyTextButton';
import SeedPhrase from 'components/SeedPhrase';

export default ({ mnemonic, next }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Description>
        {t('accountSetupModal.createWithSecret.description')}
      </Description>
      <Warning>
        <Trans i18nKey="accountSetupModal.createWithSecret.warning" />
      </Warning>
      <SeedPhrase value={mnemonic} />
      <CopyTextButton text={mnemonic} style={{ alignSelf: 'center' }}>
        {t('accountSetupModal.createWithSecret.copy')}
      </CopyTextButton>
      <Button onClick={next}>{t('buttonText.continue')}</Button>
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
  color: ${({ theme }) => theme.text.color.secondary};
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
