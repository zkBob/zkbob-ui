import { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import OptionButton from 'components/OptionButton';

import { ModalContext } from 'contexts';

const links = [
  { key: 'dune', href: 'https://dune.com/projects/zkBob' },
  { key: 'docs', href: 'https://docs.zkbob.com/' },
  { key: 'linktree', href: 'https://linktr.ee/zkbob' },
];

const Content = ({ close }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Title>{t('more.title')}</Title>
      {links.map((link, index) =>
        <OptionButton
          key={index}
          type="link"
          href={link.href}
          onClick={close}
          data-ga-id={'extra-menu-' + link.key}
        >
          {t(`more.${link.key}`)}
        </OptionButton>
      )}
    </Container>
  );
};

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
