import React from 'react';
import styled from 'styled-components';

import LinkDefault from 'components/Link';

export default () => (
  <DemoBanner>
    For secure deposits, withdrawals and full-featured privacy,{' '}
    create a <Link href="/" internal>zkBob account here</Link>
  </DemoBanner>
);

const DemoBanner = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 6px 22px;
  background: ${props => props.theme.color.purpleExtraLight};
  color: ${props => props.theme.color.white};
  font-size: 14px;
  line-height: 22px;
  font-weight: ${props => props.theme.text.weight.bold};
  text-align: center;
  position: relative;
`;

const Link = styled(LinkDefault)`
  color: ${props => props.theme.color.white};
  font-weight: ${props => props.theme.text.weight.bold};
  text-decoration: underline;
`;
