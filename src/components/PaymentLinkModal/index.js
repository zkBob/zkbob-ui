import React, { useContext, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Modal from 'components/Modal';
import Tooltip from 'components/Tooltip';
import Link from 'components/Link';

import { ReactComponent as CopyIconDefault } from 'assets/copy.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';

import { ModalContext, ZkAccountContext } from 'contexts';

export default () => {
  const { isPaymentLinkModalOpen, closePaymentLinkModal } = useContext(ModalContext);
  const { generateAddress } = useContext(ZkAccountContext);

  const [address, setAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const link = `${window.location.origin}/payment/${address}`;

  useEffect(() => {
    async function updateAddress() {
      const address = await generateAddress();
      setAddress(address);
    }
    updateAddress();
  }, [generateAddress]);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  return (
    <Modal
      isOpen={isPaymentLinkModalOpen}
      onClose={closePaymentLinkModal}
      title="Get payment link"
    >
      <Container>
        <Description>
          Share this link to request a private payment.<br />
          The sender will have the option to select and send any token.{' '}
          Tokens will be converted to BOB and deposited to your zkAccount.<br /><br />
          <b>Note:</b> Private payment links work on the same network where they are generated.
        </Description>
        <InputLabel>Copy and share your payment link</InputLabel>
        <CopyToClipboard text={link} onCopy={onCopy}>
          <PaymentLinkContainer>
            <LinkText>
              {link}
            </LinkText>
            <Tooltip content="Copied" placement="right" visible={isCopied}>
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Tooltip>
          </PaymentLinkContainer>
        </CopyToClipboard>
        <Link href="https://docs.zkbob.com/zkbob-overview/readme" size={16}>
          Get more info about payment links
        </Link>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 24px;
  text-align: center;
  & > b {
    font-weight: ${({ theme }) => theme.text.weight.bold};
  }
`;

const CopyIcon = styled(CopyIconDefault)``;

const PaymentLinkContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid ${props => props.theme.input.border.color.default};
  border-radius: 16px;
  background: ${props => props.theme.input.background.secondary};
  color: ${props => props.theme.text.color.primary};
  font-size: 16px;
  font-weight: 400;
  height: 60px;
  box-sizing: border-box;
  padding: 0 24px;
  outline: none;
  cursor: pointer;
  &::placeholder {
    color: ${props => props.theme.text.color.secondary};
  }
  &:hover ${CopyIcon} {
    path {
      fill: ${props => props.theme.color.purple};
    }
  }
`;

const LinkText = styled.span`
  flex: 1;
  max-width: 100%;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;

const InputLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
  margin-bottom: 10px;
  margin-top: 10px;
`;
