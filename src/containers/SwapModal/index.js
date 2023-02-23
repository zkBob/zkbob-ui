import { useContext, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

import { ModalContext } from 'contexts';
import LiFiWidget from 'containers/LiFiWidget';
import Modal from 'components/Modal';
import Button from 'components/Button';

export default () => {
  const {
    isSwapModalOpen, closeSwapModal, openSwapOptionsModal,
  } = useContext(ModalContext);
  const widgetEvents = useWidgetEvents();
  const [isInProgress, setIsInProgress] = useState(false);
  const [nextAction, setNextAction] = useState(null);

  const close = useCallback(nextAction => {
    closeSwapModal();
    if (nextAction === 'back') {
      openSwapOptionsModal();
    }
  }, [closeSwapModal, openSwapOptionsModal]);

  const tryToClose = useCallback(nextAction => {
    if (isInProgress) {
      setNextAction(nextAction);
      return;
    }
    close(nextAction);
  }, [isInProgress, close]);

  const confirm = useCallback(() => {
    close(nextAction);
    setNextAction(null);
  }, [nextAction, close]);

  const reject = () => setNextAction(null);

  useEffect(() => {
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, () => setIsInProgress(true));
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, () => setIsInProgress(false));
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, () => setIsInProgress(false));
    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return (
    <Modal
      isOpen={isSwapModalOpen}
      onClose={nextAction ? null : () => tryToClose('close')}
      onBack={nextAction ? null : () => tryToClose('back')}
      width={480}
      style={{ padding: '26px 0 0' }}
      title={!!nextAction ? 'The swap is in progress' : null}
    >
      {isInProgress && nextAction && (
        <ConfirmationContainer>
          <Text>You can close this window and return later to view the results. Do you want to close the window?</Text>
          <Row>
            <NoButton $small onClick={reject}>No</NoButton>
            <YesButton $small onClick={confirm}>Yes</YesButton>
          </Row>
        </ConfirmationContainer>
      )}
      <WidgetContainer $hidden={!!nextAction}>
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
