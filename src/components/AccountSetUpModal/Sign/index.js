import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner';
import Button from 'components/Button';

export default ({ isCreation, sign }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await sign();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [sign]);

  return (
    <Container>
      {isLoading && <Spinner />}
      <Note>
        {isCreation
          ? t('accountSetupModal.signMessageToCreate.description')
          : t('accountSetupModal.signMessageToRestore.description')
        }
      </Note>
      {!isLoading && <Button onClick={onClick}>{t('buttonText.signMessage')}</Button>}
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

const Note = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
