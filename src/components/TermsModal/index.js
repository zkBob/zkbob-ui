import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Modal from 'components/Modal';

const terms = [
  'If you are acting as an individual then you are of legal age (as applicable in your jurisdiction in which you reside)',
  'You are not a politically exposed person, that is, a person who is or has been entrusted with any prominent public function, or a politically exposed person who has stepped down',
  'You are not an immediate family member or a close associate of a politically exposed person or a politically exposed person who has stepped down',
  'You are not engaged in money laundering or the financing of terrorism',
  'Your access to the application does not violate any rule, law, regulation or directive of the countryof your residence and the jurisdiction in which you reside',
  'You have not been arrested or convicted for any offence or crime',
  'You are willing to verify your identity upon request',
];

export default ({ isOpen, confirm, cancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      title="Acknowledge the terms"
      width={480}
    >
      <Container>
        <Description>
          By proceeding to the application you acknowledge that
        </Description>
        <TermsContainer>
          {terms.map((term, index) => <Term key={index}>{term}</Term>)}
        </TermsContainer>
        <Button onClick={confirm}>Agree</Button>
        <CancelButton type="link" onClick={cancel}>Cancel</CancelButton>
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

const Description = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 22px;
  text-align: center;
  margin-bottom: 24px;
`;

const TermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20px;
`;

const Term = styled(Description)`
  margin-bottom: 12px;
  text-align: left;
  position: relative;
  &::before {
    content: ".";
    position: absolute;
    left: -14px;
    top: -6px;
    font-size: 24px;
  }
`;

const CancelButton = styled(Button)`
  display: flex;
  align-self: center;
`;
