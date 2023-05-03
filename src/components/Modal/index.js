import React from 'react';
import styled, { useTheme } from 'styled-components';
import Modal from 'react-modal';

import { ReactComponent as CrossIconDefault } from 'assets/cross.svg';
import { ReactComponent as BackIconDefault } from 'assets/back.svg';

export default ({ children, isOpen, onClose, title, onBack, width, style, containerStyle }) => {
  const theme = useTheme();
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '0',
      border: '0',
      borderRadius: '24px',
      background: theme.modal.background,
      opacity: '1',
      maxWidth: 'calc(100% - 14px)',
      maxHeight: 'calc(100% - 14px)',
    },
    overlay: {
      background: theme.modal.overlay,
      ...containerStyle,
    },
  };
  return (
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
`;

const BackIcon = styled(BackIconDefault)`
  position: absolute;
  top: 21px;
  left: 11px;
  cursor: pointer;
  padding: 10px;
`;
