import React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

import LinkDefault from 'components/Link';

export default () => (
  <DemoBanner>
    <Trans
      i18nKey="welcome.bannerDemo"
      components={{ 1: <Link href="/" internal /> }}
    />
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
