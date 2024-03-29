import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import Input from 'components/Input';

import { formatNumber } from 'utils';

const ListItem = ({ token, onClick }) => (
  <ItemContainer onClick={onClick}>
    <ItemInnerContainer>
      <Row>
        <TokenIcon src={token.logoURI} />
        <Column>
          <TokenSymbol>{token.symbol}</TokenSymbol>
          <TokenName>{token.name}</TokenName>
        </Column>
      </Row>
      {(token?.balance && !token.balance.isZero()) && (
        <Column style={{ alignItems: 'flex-end' }}>
          <TokenSymbol>{formatNumber(token.balance, token?.decimals || 18)}</TokenSymbol>
          <TokenName>{`≈ $${token?.balanceUSD || '--'}`}</TokenName>
        </Column>
      )}
    </ItemInnerContainer>
  </ItemContainer>
);

export default ({ isOpen, onClose, tokens, onSelect }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredTokens = useMemo(() =>
    tokens.filter(token =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase())
    ),
    [tokens, search]
  );

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handleSelect = token => {
    setSearch('');
    onSelect(token);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('tokenList.title')}
      width={460}
    >
      <Container>
        <Input
          placeholder={t('tokenList.searchToken')}
          secondary
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ height: 50 }}
        />
        <List>
          {filteredTokens.map((token, index) => (
            <ListItem key={index} token={token} onClick={() => handleSelect(token)} />
          ))}
        </List>
        {!filteredTokens.length && (
          <Text>{t('tokenList.noTokensFound')}</Text>
        )}
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 390px;
  box-sizing: border-box;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  @media only screen and (max-width: 560px) {
    max-height: calc(100% - 30px);
  }
`;

const TokenIcon = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 16px;
`;

const ItemInnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
`;

const ItemContainer = styled.div`
  padding: 7px 0;
  cursor: pointer;
  &:hover ${ItemInnerContainer} {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border-radius: 16px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  margin: 0 -10px;
`;

const TokenSymbol = styled.span`
  font-size: 16px;
  line-height: 20px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
`;

const TokenName = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
`;

const Text = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
