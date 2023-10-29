import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Modal from 'components/Modal';

export default ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('confirmLogoutModal.title')}
    >
      <Container>
        <Description>
          {t('confirmLogoutModal.description')}
        </Description>
        <Button onClick={onConfirm}>{t('buttonText.logout')}</Button>
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

const Description = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 22px;
  text-align: center;
`;
