import React from 'react';
import styled, { useTheme } from 'styled-components';
import Modal from 'react-modal';

import { ReactComponent as CrossIconDefault } from 'assets/cross.svg';

export default ({ children, isOpen, onClose, title }) => {
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
    },
    overlay: {
      background: theme.modal.overlay,
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={title}
    >
      <ModalContent>
        <Title>{title}</Title>
        <CrossIcon onClick={onClose} />
        {children}
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 26px 32px 32px;
  box-sizing: border-box;
  position: relative;
`;

const Title = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  margin-bottom: 24px;
`;

const CrossIcon = styled(CrossIconDefault)`
  position: absolute;
  top: 31px;
  right: 21px;
  cursor: pointer;
`;
