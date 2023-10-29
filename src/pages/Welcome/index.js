import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AccountSetUpButton from 'containers/AccountSetUpButton';

import Card from 'components/Card';
import Button from 'components/Button';

// import { ReactComponent as BobIconDefault } from 'assets/bob.svg';

import { ZkAccountContext } from 'contexts';

export default () => {
  const { t } = useTranslation();
  const { isDemo } = useContext(ZkAccountContext);
  const history = useHistory();
  const location = useLocation();
  return (
    <Card>
      <Container>
        {isDemo ? (
          <>
            <Title>{t('welcome.titleDemo')}</Title>
            <Description>
              {/* <Row>
                <Text>Congrats! You have</Text>
                <BobIcon />
                <Text><b>10 BOB</b></Text>
              </Row> */}
              <Row>
                <Text>{t('welcome.descriptionDemo')}</Text>
              </Row>
            </Description>
            <Button onClick={() => history.push('/transfer' + location.search)}>
              {t('buttonText.transfer')}
            </Button>
          </>
        ) : (
          <>
            <Title>{t('welcome.title')}</Title>
            <Description>
              <Text>{t('welcome.description')}</Text>
            </Description>
            <AccountSetUpButton />
          </>
        )}
      </Container>
    </Card>
  );
};

const Title = styled.span`
  font-size: 24px;
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
  text-align: center;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px 20px;
  @media only screen and (max-width: 500px) {
    padding: 0 6px 12px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0 24px;
`;

// const BobIcon = styled(BobIconDefault)`
//   width: 20px;
//   height: 20px;
//   margin: 0 5px;
// `;
