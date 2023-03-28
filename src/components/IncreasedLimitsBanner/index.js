import styled from 'styled-components';

import DefaultLink from 'components/Link';
import DefaultButton from 'components/Button';

import { ReactComponent as InfinityLoopIcon } from 'assets/infinity-loop.svg';
import { ReactComponent as WargingIcon } from 'assets/warning.svg';

import { INCREASED_LIMITS_STATUSES } from 'constants';

export default ({ status, account, openModal }) => {
  let component;
  switch(status) {
    default:
    case null:
    case INCREASED_LIMITS_STATUSES.INACTIVE:
      component = <>
        <InfinityLoopIcon />
        <Text>Want to increase your deposit limits?</Text>
        <Button type="link" onClick={openModal}>Learn more</Button>
      </>;
      break;
    case INCREASED_LIMITS_STATUSES.ACTIVE:
      component = <>
        <InfinityLoopIcon />
        <Text>Increased deposit limits activated</Text>
      </>;
      break;
    case INCREASED_LIMITS_STATUSES.RESYNC:
      component = <>
        <WargingIcon />
        <Text>To restore increased deposit limits - </Text>
        <Link href={process.env.REACT_APP_KYC_HOMEPAGE_URL?.replace('%s', account)}>resync your BAB token</Link>
      </>;
      break;
  }
  return (
    <Container>
      {component}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 480px;
  max-width: 100%;
  border-radius: 10px;
  background: ${props => props.theme.color.yellow};
  margin: 20px 0 -10px;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: ${props => props.theme.text.weight.bold};
  color: ${props => props.theme.text.color.secondary};
  margin: 0 5px 0 8px;
`;

const Link = styled(DefaultLink)`
  font-weight: ${props => props.theme.text.weight.bold};
`;

const Button = styled(DefaultButton)`
  font-weight: ${props => props.theme.text.weight.bold};
`;
