import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Modal from 'react-modal';

import { ReactComponent as CrossIconDefault } from 'assets/cross.svg';
import { ReactComponent as BackIconDefault } from 'assets/back.svg';

const GlobalStyle = createGlobalStyle`
  .ReactModal__Content {
    top: 50% !important;
    left: 50% !important;
    right: auto !important;
    bottom: auto !important;
    margin-right: -50% !important;
    transform: translate(-50%, -50%) !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 24px !important;
    background: ${({ theme }) => theme.modal.background} !important;
    opacity: 1 !important;
    @media only screen and (max-width: 420px) {
      width: 100% !important;
      height: 100% !important;
      border-radius: 0 !important;
    }
  }
  .ReactModal__Overlay {
    background: ${({ theme }) => theme.modal.overlay} !important;
    z-index: 1 !important;
  }
`;

export default ({ children, isOpen, onClose, title, onBack, width, style, containerStyle }) => {
  const customStyles = { overlay: { ...containerStyle } };
  return (
    <>
      <GlobalStyle />
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={customStyles}
        contentLabel={title}
        appElement={document.body}
      >
        <ModalContent width={width} style={style}>
          <Title>{title}</Title>
          {onBack && <BackIcon onClick={onBack} />}
          {onClose && <CrossIcon onClick={onClose} />}
          {children}
        </ModalContent>
      </Modal>
    </>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${props => props.width ? `${props.width}px` : '420px'};
  max-width: 100%;
  padding: 26px;
  box-sizing: border-box;
  position: relative;
  @media only screen and (max-width: 420px) {
    padding: 26px 13px;
    width: 100%;
    height: 100%;
    max-height: 100%;
    justify-content: center;
  }
`;

const Title = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  margin-bottom: 24px;
  padding: 0 20px;
  text-align: center;
`;

const CrossIcon = styled(CrossIconDefault)`
  position: absolute;
  top: 31px;
  right: 21px;
  cursor: pointer;
  @media only screen and (max-width: 420px) {
    top: 21px;
  }
`;

const BackIcon = styled(BackIconDefault)`
  position: absolute;
  top: 21px;
  left: 11px;
  cursor: pointer;
  padding: 10px;
  @media only screen and (max-width: 420px) {
    top: 11px;
  }
`;
