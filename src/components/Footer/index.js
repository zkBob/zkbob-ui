import React, { useContext } from 'react';
import styled from 'styled-components';

import Link from 'components/Link';
import Button from 'components/Button';

import { ModalContext } from 'contexts';

export default () => {
  const { openSwapOptionsModal } = useContext(ModalContext);

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
    <>
      <Row>
        {/* <Title>© zkBob 2022</Title> */}
        {sections.map((column, index) => (
          <InnerRow key={index}>
            <Title>{column?.title}</Title>
            {column?.links.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.name}
              </Link>
            ))}
            {column?.components?.map(component => component)}
          </InnerRow>
        ))}
      </Row>
    </>
  );
};

const Row = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: 60px;
  &:first-child {
    margin-left: 0;
  }
  & > * {
    margin-left: 20px;
  }
`;

const Title = styled.span`
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
  margin-left: 0;
`;
