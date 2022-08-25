import React from 'react';
import styled, { useTheme } from 'styled-components';

import Link from 'components/Link';

import { ReactComponent as Logo } from 'assets/logo.svg';

const columns = [
  null,
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: 'https://docs.zkbob.com/' },
      { name: 'FAQ', href: 'https://docs.zkbob.com/' },
    ]
  },
  {
    title: 'Community',
    links: [
      { name: 'Telegram', href: 'https://docs.zkbob.com/' },
      { name: 'GitHub', href: 'https://docs.zkbob.com/' },
    ]
  },
  {
    title: 'BOB Stable Token',
    links: [
      { name: 'View contract', href: 'https://docs.zkbob.com/' },
      { name: 'Buy', href: 'https://docs.zkbob.com/' },
    ]
  }
];

export default () => {
  const theme = useTheme();
  return (
    <>
      <Divider />
      <Container>
        <Column>
          <Logo />
        </Column>
        {columns.map(column => (
          <Column>
            <Title>{column?.title}</Title>
            {column?.links.map(link => (
              <Link
                href={link.href}
                style={{ color: theme.text.color.secondary }}
              >
                {link.name}
              </Link>
            ))}
          </Column>
        ))}
      </Container>
    </>
  );
};

const Divider = styled.div`
  margin: 0 -40px;
  height: 1px;
  border-top: 1px solid ${props => props.theme.color.darkGrey};
`;

const Container = styled.div`
  display: flex;
  padding-top: 30px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  & > * {
    margin-bottom: 12px;
  }
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.span`
  color: ${props => props.theme.text.color.primary};
  font-weight: ${props => props.theme.text.weight.bold};
`;
