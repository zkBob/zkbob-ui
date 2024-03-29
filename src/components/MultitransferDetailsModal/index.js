import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import Tooltip from 'components/Tooltip';
import { ZkAvatar } from 'components/ZkAccountIdentifier';

import { ReactComponent as IncognitoAvatar } from 'assets/incognito-avatar.svg';

import { formatNumber, shortAddress } from 'utils';
import { TOKENS_ICONS } from 'constants';

const ListItem = ({ index, data, zkAccount, currentPool }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  return (
    <ItemContainer>
      <Index>{index + 1}</Index>
      {data.isLoopback ? (
        <ZkAvatar seed={zkAccount} size={16} />
      ) : (
        <IncognitoAvatar />
      )}
      <Tooltip
          content={data.address}
          delay={0.3}
          placement="bottom"
          width={300}
          style={{
            wordBreak: 'break-all',
            textAlign: 'center',
          }}
        >
          <Tooltip content={t('common.copied')} placement="right" visible={isCopied}>
            <CopyToClipboard text={data.address} onCopy={onCopy}>
              <Address>
                {shortAddress(data.address, 22)}
              </Address>
            </CopyToClipboard>
          </Tooltip>
        </Tooltip>
      <Amount>
        {formatNumber(data.amount, currentPool.tokenDecimals, 18)} {currentPool.tokenSymbol}
      </Amount>
    </ItemContainer>
  );
}

export default ({ isOpen, onClose, onBack, transfers, isSent, zkAccount, currentPool }) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title={t('multitransfer.addressesList')}
      width={460}
    >
      <Container>
        <DetailsContainer>
          <AmountContainer>
            <TokenIcon src={TOKENS_ICONS[currentPool.tokenSymbol]} />
            <TotalAmount>
              {formatNumber(
                transfers.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero),
                currentPool.tokenDecimals,
                18
              )}
              {' '}
            </TotalAmount>
            <TokenSymbol>{currentPool.tokenSymbol}</TokenSymbol>
          </AmountContainer>
          <Text>
            {t(`multitransfer.${isSent ? 'hasBeen' : 'willBe'}TransferredTo`, { count: transfers.length })}
          </Text>
        </DetailsContainer>
        <List>
          {transfers.map((transfer, index) => (
            <ListItem
              key={index}
              index={index}
              data={transfer}
              zkAccount={zkAccount}
              currentPool={currentPool}
            />
          ))}
        </List>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 440px;
  box-sizing: border-box;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const TokenSymbol = styled.span`
  font-size: 36px;
  white-space: nowrap;
  color: ${props => props.theme.text.color.primary}
`;

const TotalAmount = styled(TokenSymbol)`
  font-weight: ${props => props.theme.text.weight.bold};
  margin-right: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 24px;
  background-color: ${props => props.theme.color.grey};
  border-radius: 12px;
  margin-bottom: 20px;
  overflow-wrap: anywhere;
`;

const MediumText = styled.span`
  font-size: 16px;
  text-align: center;
  color: ${props => props.theme.text.color.primary};
  margin-bottom: 5px;
`;

const ItemContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Text = styled(MediumText)`
  margin-bottom: 0;
  margin-top: 10px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const Index = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color.secondary};
  margin-right: 6px;
  min-width: 16px;
`;

const Amount = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color.primary};
  flex: 1;
  text-align: end;
`;

const Address = styled(Amount)`
  margin-left: 5px;
  cursor: pointer;
`;
