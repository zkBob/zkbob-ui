import { useContext, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useTranslation } from 'react-i18next';

import { ModalContext } from 'contexts';
import LiFiWidget from 'containers/LiFiWidget';
import Modal from 'components/Modal';
import Button from 'components/Button';

export default () => {
  const { t } = useTranslation();
  const { isSwapModalOpen, closeSwapModal } = useContext(ModalContext);
  const widgetEvents = useWidgetEvents();
  const [isInProgress, setIsInProgress] = useState(false);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);

  const tryToClose = useCallback(() => {
    if (isInProgress) {
      setIsConfirmationShown(true);
      return;
    }
    closeSwapModal();
  }, [isInProgress, closeSwapModal]);

  const confirm = useCallback(() => {
    closeSwapModal();
    setIsConfirmationShown(false);
  }, [closeSwapModal]);

  const reject = () => setIsConfirmationShown(false);

  useEffect(() => {
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, () => setIsInProgress(true));
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, () => setIsInProgress(false));
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, () => setIsInProgress(false));
    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return (
    <Modal
      isOpen={isSwapModalOpen}
      onClose={isConfirmationShown ? null : () => tryToClose()}
      width={480}
      style={{ padding: '26px 0 0' }}
      title={isConfirmationShown ? t('swapModal.title') : null}
    >
      {isInProgress && isConfirmationShown && (
        <ConfirmationContainer>
          <Text>{t('swapModal.description')}</Text>
          <Row>
            <NoButton onClick={reject}>{t('buttonText.no')}</NoButton>
            <YesButton onClick={confirm}>{t('buttonText.yes')}</YesButton>
          </Row>
        </ConfirmationContainer>
      )}
      <WidgetContainer $hidden={isConfirmationShown}>
        <LiFiWidget />
      </WidgetContainer>
    </Modal>
  );
}

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  visibility: ${props => props.$hidden ? 'hidden' : 'visible' };
  height: ${props => props.$hidden ? '0px' : 'auto' };
`;

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px 30px;
  width: 100%;
  box-sizing: border-box;
  margin-top: -10px;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color.secondary};
  text-align: center;
  line-height: 24px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
`;

const YesButton = styled(Button)`
  flex: 1;
  height: 48px;
  font-size: 16px;
`;

const NoButton = styled(YesButton)`
  background: transparent;
  border: 1px solid ${props => props.theme.button.primary.background.default};
  color: ${props => props.theme.button.primary.background.default};
  margin-right: 10px;
`;
