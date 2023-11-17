import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import zkBobLibPackage from 'zkbob-client-js/package.json';
import appPackage from '../../../package.json';

import { SupportIdContext, ZkAccountContext } from 'contexts';

import Link from 'components/Link';

import { ReactComponent as TwitterIcon } from 'assets/twitter.svg';
import { ReactComponent as TelegramIcon } from 'assets/telegram.svg';
import { ReactComponent as MirrorIcon } from 'assets/mirror.svg';
import { ReactComponent as GithubIcon } from 'assets/github.svg';


export default () => {
  const { t } = useTranslation();
  const { supportId } = useContext(SupportIdContext);
  const { relayerVersion } = useContext(ZkAccountContext);

  const resources = [
    { icon: TwitterIcon, href: 'https://twitter.com/zkBob_' },
    { icon: TelegramIcon, href: 'https://t.me/zkbobcommunity' },
    { icon: MirrorIcon, href: 'https://blog.zkbob.com/' },
    { icon: GithubIcon, href: 'https://github.com/zkBob' },
  ];

  return (
    <Column>
      <Row>
        <InnerRow>
          {resources.map((resource, index) => (
            <CustomLink key={index} href={resource.href} target="">
              {React.createElement(resource.icon, {})}
            </CustomLink>
          ))}
        </InnerRow>
      </Row>
      <Row>
        <InnerRow>
          <Text>{t('common.web')}: v{appPackage.version}</Text>
          <Text>{t('common.library')}: v{zkBobLibPackage.version}</Text>
          <Text>{t('common.relayer')}: {relayerVersion || 'N/A'}</Text>
          <TextRow>
            <Text style={{ marginRight: 4 }}>{t('common.supportId')}:</Text>
            <Text>{supportId}</Text>
          </TextRow>
        </InnerRow>
      </Row>
    </Column>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    margin: 7px 10px 0;
  }
`;

const Text = styled.span`
  font-size: 14px;
  color: #A7A2B8;
  font-weight: ${props => props.theme.text.weight.bold};
  line-height: 20px;
  text-align: center;
`;

const TextRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const CustomLink = styled(Link)`
  color: #A7A2B8;
  font-size: 14px;
  font-weight: ${props => props.theme.text.weight.bold};
`;
