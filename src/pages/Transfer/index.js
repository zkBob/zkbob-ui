import React, { useContext, useState, useRef } from 'react';
import styled from 'styled-components';
import { HistoryTransactionType } from 'zkbob-client-js';

import PendingAction from 'containers/PendingAction';

import Card from 'components/Card';
import LatestAction from 'components/LatestAction';
import Switch from 'components/Switch';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import { ReactComponent as InfoIconDefault } from 'assets/info.svg';

import SingleTransfer from './SingleTransfer';
import MultiTransfer from './MultiTransfer';

import { ZkAccountContext } from 'contexts';

import { useLatestAction } from 'hooks';

const note = 'The transfer will be performed privately within the zero knowledge pool. Sender, recipient and amount are never disclosed.';
const tooltipText = 'Click Upload CSV to add a prepared .csv file from your machine. Each row should contain: zkAddress, amount';

export default () => {
  const { isPending } = useContext(ZkAccountContext);
  const latestAction = useLatestAction(HistoryTransactionType.TransferOut);
  const [isMulti, setIsMulti] = useState(false);
  const multitransferRef = useRef(null);
  const fileInputRef = useRef(null);

  return isPending ? <PendingAction /> : (
    <>
      <Card note={note}>
        <TitleRow>
          <Title>Transfer</Title>
          <Row>
            <Text>Multitransfer</Text>
            <Switch checked={isMulti} onChange={setIsMulti} />
            <CsvButtonContainer disabled={!isMulti}>
              <Button
                type="link"
                onClick={() => fileInputRef?.current?.click()}
              >
                Upload CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={e => multitransferRef?.current?.handleFileUpload(e)}
                style={{ display: 'none' }}
              />
              <Tooltip content={tooltipText} placement="right" delay={0} width={180}>
                <InfoIcon />
              </Tooltip>
            </CsvButtonContainer>
          </Row>
        </TitleRow>
        {isMulti ? <MultiTransfer ref={multitransferRef} /> : <SingleTransfer />}
      </Card>
      {latestAction && (
        <LatestAction
          type="Transfer"
          shielded={true}
          actions={latestAction.actions}
          txHash={latestAction.txHash}
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
