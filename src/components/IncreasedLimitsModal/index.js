import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Link from 'components/Link';
import Modal from 'components/Modal';

const DOCS_URL = 'https://www.binance.com/en/support/faq/how-to-mint-binance-account-bound-bab-token-bacaf9595b52440ea2b023195ba4a09c';

export default ({ isOpen, onClose, account, isWalletModalOpen, openWalletModal, currentPool }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extended limits"
      containerStyle={{ visibility: isWalletModalOpen ? 'hidden' : 'visible' }}
    >
      <Container>
        <Text>
          To increase personal deposit limits you need to own a BAB token on the BNB Smart chain. What's a BAB token?
          <Link href={DOCS_URL} style={{ marginLeft: 5 }}>Find out now.</Link>
          <br /><br />
          Verify your BAB:
          <List>
            <li>
              Connect the Metamask or WalletConnect wallet containing your BAB token to zkBob. You DO NOT need to switch networks, stay on Polygon.
            </li>
            <li>
              Click Verify my BAB token below.
            </li>
          </List>
          <br />
          That's it. Your deposit limits will automatically increase if your connected wallet contains a BAB token.
        </Text>
        {account ? (
          <LinkButton href={currentPool.kycUrls?.homepage.replace('%s', account)}>
            Verify my BAB token
          </LinkButton>
        ) : (
          <Button onClick={openWalletModal}>Connect wallet</Button>
        )}
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px 6px;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 22px;
  margin-bottom: 24px;
`;

const List = styled.ol`
  padding-inline-start: 15px;
  margin: 0;
`;

const LinkButton = styled(Link)`
  background: ${props => props.theme.button.primary.background.default};
  color: ${props => props.theme.button.primary.text.color.default};
  font-size: ${props => props.theme.button.primary.text.size.default};
  font-weight: ${props => props.theme.button.primary.text.weight.default};
  height: 60px;
  box-sizing: border-box;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
