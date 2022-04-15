import React from 'react';
import styled from 'styled-components';

export default ({ title, note, children }) => (
  <Card>
    <Title>{title}</Title>
    {children}
    {note && <Note>{note}</Note>}
  </Card>
);

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.card.background};
  box-shadow: 0px 8px 50px rgba(255, 214, 110, 0.2);
  border-radius: 24px;
  padding: 16px 12px 12px;
  width: 480px;
  box-sizing: border-box;
  & > * {
    margin-bottom: 12px;
  }
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.span`
  color: ${props => props.theme.card.title.color};
  font-weight: ${props => props.theme.text.weight.normal};
`;

const Note = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: ${props => props.theme.card.note.color};
  font-weight: ${props => props.theme.text.weight.normal};
  align-self: center;
  text-align: center;
`;
