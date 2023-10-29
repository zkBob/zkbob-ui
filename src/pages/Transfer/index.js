import React, { useContext, useState, useRef } from 'react';
import styled from 'styled-components';
import { HistoryTransactionType } from 'zkbob-client-js';
import { useTranslation } from 'react-i18next';

import PendingAction from 'containers/PendingAction';

import Card from 'components/Card';
import LatestAction from 'components/LatestAction';
import Switch from 'components/Switch';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import SingleTransfer from './SingleTransfer';
import MultiTransfer from './MultiTransfer';

import { ZkAccountContext, PoolContext } from 'contexts';

import { useLatestAction } from 'hooks';


export default () => {
  const { t } = useTranslation();
  const { isPending } = useContext(ZkAccountContext);
  const latestAction = useLatestAction(HistoryTransactionType.TransferOut);
  const [isMulti, setIsMulti] = useState(false);
  const multitransferRef = useRef(null);
  const fileInputRef = useRef(null);
  const { currentPool } = useContext(PoolContext);

  return isPending ? <PendingAction /> : (
    <>
      <Card note={t('transfer.note')}>
        <TitleRow>
          <Title>{t('transfer.title')}</Title>
          <Row>
            <Text>{t('multitransfer.title')}</Text>
            <Switch
              checked={isMulti}
              onChange={setIsMulti}
              data-ga-id={`turn-${isMulti ? 'off' : 'on'}-multitransfer`}
            />
            <CsvButtonContainer disabled={!isMulti}>
              <Button
                type="link"
                onClick={() => fileInputRef?.current?.click()}
              >
                {t('multitransfer.uploadCSV')}
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={e => multitransferRef?.current?.handleFileUpload(e)}
                style={{ display: 'none' }}
              />
              <Tooltip content={t('multitransfer.uploadCSVHint')} placement="right" delay={0} width={180}>
                <InfoIcon />
              </Tooltip>
            </CsvButtonContainer>
          </Row>
        </TitleRow>
        {isMulti ? <MultiTransfer ref={multitransferRef} /> : <SingleTransfer />}
      </Card>
      {latestAction && (
        <LatestAction
          type="transfer"
          shielded={true}
          data={latestAction}
          currentPool={currentPool}
        />
      )}
    </>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const TitleRow = styled(Row)`
  padding: 0 10px;
`;

const Title = styled.span`
  color: ${props => props.theme.card.title.color};
  font-size: 16px;
  font-weight: ${props => props.theme.text.weight.normal};
  flex: 1;
`;

const Text = styled(Title)`
  color: ${props => props.theme.card.title.color};
  font-size: 14px;
  font-weight: ${props => props.theme.text.weight.normal};
  margin-right: 6px;
`;

const InfoIcon = styled(InfoIconDefault)`
  margin-left: 4px;
  &:hover {
    & > path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;

const CsvButtonContainer = styled(Row)`
  margin-left: 12px;
  opacity: ${props => props.disabled ? 0.2 : 1};
  position: relative;
  ${props => props.disabled && `
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  `}
`;
