import React from 'react';
import styled from 'styled-components';

import Link from 'components/Link';


const sections = [
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: 'https://docs.zkbob.com/' },
      { name: 'FAQ', href: 'https://docs.zkbob.com/zkbob-overview/faq' },
      { name: 'Linktree', href: 'https://linktr.ee/zkbob' },
    ]
  },
  {
    title: 'BOB Stable Token',
    links: [
      {
        name: 'View contract',
        href: process.env.REACT_APP_EXPLORER_ADDRESS_TEMPLATE.replace('%s', process.env.REACT_APP_TOKEN_ADDRESS),
      },
      { name: 'Get BOB', href: 'https://docs.zkbob.com/' },
    ]
  }
];

export default () => {
  return (
    <>
      <Row>
        <Title>© zkBob 2022</Title>
        {sections.map((column, index) => (
          <InnerRow key={index}>
            <Title>{column?.title}</Title>
            {column?.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                style={{ marginLeft: 20 }}
              >
                {link.name}
              </Link>
            ))}
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
`;

const Title = styled.span`
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.normal};
`;