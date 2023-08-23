import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';

import arrowLeft from 'assets/arrow-left.svg';
import arrowRight from 'assets/arrow-right.svg';

export default ({ currentPage, numberOfPages, setCurrentPage }) => {
  const { t } = useTranslation();
  return (
    <Row>
      <Button type="link" onClick={() => setCurrentPage(1)}>{t('pagination.first')}</Button>
      <InnerRow>
        <Arrow
          $visible={currentPage !== 1}
          src={arrowLeft}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        />
        <Text>{t('pagination.current', { current: currentPage, total: numberOfPages })}</Text>
        <Arrow
          $visible={currentPage !== numberOfPages}
          src={arrowRight}
          onClick={() => setCurrentPage(Math.min(currentPage + 1, numberOfPages))}
        />
      </InnerRow>
      <Button type="link" onClick={() => setCurrentPage(numberOfPages)}>{t('pagination.last')}</Button>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 7px 10px;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text.color.primary};
  margin: 0 20px;
`;

const Arrow = styled.img`
  cursor: pointer;
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
`;
