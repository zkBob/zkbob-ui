import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import OptionButton from 'components/OptionButton';

const links = [
  { name: 'Dune Analytics', href: 'https://dune.com/projects/zkBob' },
  { name: 'Documentation', href: 'https://docs.zkbob.com/' },
  { name: 'Linktree', href: 'https://linktr.ee/zkbob' },
];

const Content = ({ buttonRef }) => (
  <Container>
    <Title>More about zkBob</Title>
    {links.map((link, index) =>
      <OptionButton
        key={index}
        type="link"
        href={link.href}
        onClick={() => buttonRef.current.click()}
      >
        {link.name}
      </OptionButton>
    )}
  </Container>
);

export default ({ buttonRef, openSwapModal, children, currentPool }) => (
  <Dropdown
    content={() =>
      <Content buttonRef={buttonRef} openSwapModal={openSwapModal} currentPool={currentPool} />
    }
  >
    {children}
  </Dropdown>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin-bottom: 20px;
`;
