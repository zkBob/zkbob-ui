import { useContext } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import OptionButton from 'components/OptionButton';

import { ModalContext } from 'contexts';

const links = [
  { name: 'Dune Analytics', href: 'https://dune.com/projects/zkBob' },
  { name: 'Documentation', href: 'https://docs.zkbob.com/' },
  { name: 'Linktree', href: 'https://linktr.ee/zkbob' },
];

const Content = ({ close }) => (
  <Container>
    <Title>More about zkBob</Title>
    {links.map((link, index) =>
      <OptionButton
        key={index}
        type="link"
        href={link.href}
        onClick={close}
      >
        {link.name}
      </OptionButton>
    )}
  </Container>
);

export default ({ children }) => {
  const { isMoreDropdownOpen, openMoreDropdown, closeMoreDropdown } = useContext(ModalContext);
  return (
    <Dropdown
      isOpen={isMoreDropdownOpen}
      open={openMoreDropdown}
      close={closeMoreDropdown}
      content={() => <Content close={closeMoreDropdown} />}
    >
      {children}
    </Dropdown>
  );
};

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
