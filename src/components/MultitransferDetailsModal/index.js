import React from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import Modal from 'components/Modal';
import Tooltip from 'components/Tooltip';

import { ReactComponent as IncognitoAvatar } from 'assets/incognito-avatar.svg';

import { tokenSymbol, tokenIcon } from 'utils/token';
import { formatNumber, shortAddress } from 'utils';

export default ({ isOpen, onClose, transfers }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multitransfer"
      width={460}
    >
      <Container>
        <DetailsContainer>
          <AmountContainer>
            <TokenIcon src={tokenIcon()} />
            <TotalAmount>
              {formatNumber(transfers.reduce((acc, curr) => acc.add(curr.amount), ethers.constants.Zero), 18)}
              {' '}
            </TotalAmount>
            <TokenSymbol>{tokenSymbol()}</TokenSymbol>
          </AmountContainer>
          <Text>will be transferred to {transfers.length} zkBob addresses</Text>
        </DetailsContainer>
        <List>
          {transfers.map((transfer, index) => (
            <ListItem key={index}>
              <Index>{index + 1}</Index>
              <IncognitoAvatar />
              <Tooltip
                  content={transfer.address}
                  delay={0.3}
                  placement="bottom"
                  width={300}
                  style={{
                    wordBreak: 'break-all',
                    textAlign: 'center',
                  }}
                >
                  <Address>
                    {shortAddress(transfer.address, 22)}
                  </Address>
                </Tooltip>
              <Amount>
                {formatNumber(transfer.amount, 18)} {tokenSymbol()}
              </Amount>
            </ListItem>
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

const ListItem = styled.div`
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
`;
