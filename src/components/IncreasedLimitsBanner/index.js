import styled from 'styled-components';

import DefaultLink from 'components/Link';
import DefaultButton from 'components/Button';

import { ReactComponent as InfinityLoopIconDefault } from 'assets/infinity-loop.svg';
import { ReactComponent as WargingIconDefault } from 'assets/warning.svg';

import { INCREASED_LIMITS_STATUSES } from 'constants';

export default ({ status, account, openModal, kycUrls }) => {
  let component;
  switch(status) {
    default:
    case null:
    case INCREASED_LIMITS_STATUSES.INACTIVE:
      component = <>
        <InfinityLoopIcon />
        <Text>Want to increase your deposit limits?</Text>
        <Button type="link" onClick={openModal} data-ga-id="kyc-banner">Learn more</Button>
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
        <Row>
          <Text>To restore increased deposit limits -</Text>
          <Link href={kycUrls?.homepage.replace('%s', account)}>resync your BAB token</Link>
        </Row>
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
  min-height: 36px;
  width: 480px;
  max-width: 100%;
  border-radius: 10px;
  background: ${props => props.theme.color.yellow};
  margin: 20px 0 -10px;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const Text = styled.span`
  font-size: 14px;
  font-weight: ${props => props.theme.text.weight.bold};
  color: ${props => props.theme.text.color.secondary};
  margin-right: 5px;
`;

const Link = styled(DefaultLink)`
  font-weight: ${props => props.theme.text.weight.bold};
`;

const Button = styled(DefaultButton)`
  font-weight: ${props => props.theme.text.weight.bold};
`;

const Row = styled.div`
  white-space: pre-wrap; /* CSS3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
`;

const InfinityLoopIcon = styled(InfinityLoopIconDefault)`
  margin-right: 8px;
`;

const WargingIcon = styled(WargingIconDefault)`
  margin-right: 8px;
`;
