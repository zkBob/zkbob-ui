import React from 'react';
import styled from 'styled-components';

import Modal from 'components/Modal';
import Link from 'components/Link';

import { ReactComponent as LinkIcon } from 'assets/external-link.svg';

export default ({ isOpen, onClose, openSwapModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get BOB">
      <SwapOption onClick={openSwapModal}>
        <SwapOptionName>Swap using Li.Fi</SwapOptionName>
      </SwapOption>
      <SwapOptionLink href="https://zkbob.page.link/getBOB">
        <SwapOptionName>Other options</SwapOptionName>
        <LinkIcon />
      </SwapOptionLink>
    </Modal>
  );
};

const SwapOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.walletConnectorOption.background.default};
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.hover};
  }
`;

const SwapOptionLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.walletConnectorOption.background.default};
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.hover};
  }
`;

const SwapOptionName = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.normal};
`;
