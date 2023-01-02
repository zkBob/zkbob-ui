import React, { useContext } from 'react';
import styled from 'styled-components';
import zkBobLibPackage from 'zkbob-client-js/package.json';

import Link from 'components/Link';
import Button from 'components/Button';

import { ModalContext, SupportIdContext } from 'contexts';


export default () => {
  const { openSwapOptionsModal } = useContext(ModalContext);
  const { supportId } = useContext(SupportIdContext);

  const sections = [
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: 'https://docs.zkbob.com/' },
        { name: 'FAQ', href: 'https://docs.zkbob.com/zkbob-overview/faq' },
        { name: 'Linktree', href: 'https://linktr.ee/zkbob' },
        { name: 'Dune Analytics', href: 'https://dune.com/maxaleks/zkbob' },
      ]
    },
    {
      title: 'BOB Stable Token',
      links: [
        {
          name: 'View contract',
          href: `${process.env.REACT_APP_EXPLORER_URL}/token/${process.env.REACT_APP_TOKEN_ADDRESS}`,
        },
      ],
      components: [
        <Button key={'getbob'} type="link" onClick={openSwapOptionsModal}>Get BOB</Button>
      ]
    }
  ];

  return (
    <Column>
      <Row>
        {/* <Title>© zkBob 2022</Title> */}
        {sections.map((column, index) => (
          <InnerRow key={index}>
            <Text>{column?.title}</Text>
            {column?.links.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.name}
              </Link>
            ))}
            {column?.components?.map(component => component)}
          </InnerRow>
        ))}
      </Row>
      <Row>
        <InnerRow>
          <Text>Web: v{process.env.REACT_APP_VERSION}</Text>
          <Text>Library: v{zkBobLibPackage.version}</Text>
          <Text>Support ID: {supportId}</Text>
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
  margin-top: 20px;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
  & > * {
    margin-left: 20px;
  }
`;

const Text = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  font-weight: ${props => props.theme.text.weight.normal};
`;
