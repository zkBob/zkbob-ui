import { useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Dropdown from 'components/Dropdown';
import OptionButton from 'components/OptionButton';

import { ModalContext, LanguageContext } from 'contexts';

import { ReactComponent as BackIconDefault } from 'assets/back.svg';
import { ReactComponent as DropdownIconDefault } from 'assets/dropdown.svg';

const links = [
  { key: 'dune', href: 'https://dune.com/projects/zkBob' },
  { key: 'docs', href: 'https://docs.zkbob.com/' },
  { key: 'linktree', href: 'https://linktr.ee/zkbob' },
];

const languages = {
  en: 'English',
  pt: 'Português',
};

const Content = ({ close }) => {
  const { changeLanguage } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const [showLanguages, setShowLanguages] = useState(false);

  const selectLanguage = useCallback(lang => {
    changeLanguage(lang);
    setShowLanguages(false);
    close();
  }, [close, changeLanguage])

  if (showLanguages) {
    return (
      <Container>
        <BackIcon onClick={() => setShowLanguages(false)} />
        <Title style={{ marginBottom: 20 }}>{t('common.language')}</Title>
        {Object.keys(languages).map((lang, index) =>
          <LanguageButton
            key={index}
            onClick={() => selectLanguage(lang)}
            data-ga-id={`extra-menu-language-${lang}`}
            $active={lang === i18n.resolvedLanguage}
          >
            <Row>
              <LangIcon src={require(`assets/languages/${lang}.svg`)} />
              {languages[lang]}
            </Row>
          </LanguageButton>
        )}
      </Container>
    )
  }

  return (
    <Container>
      <SmallText>{t('more.title')}</SmallText>
      <OptionButton
        onClick={() => setShowLanguages(true)}
        data-ga-id={`extra-menu-language-${i18n.resolvedLanguage}`}
      >
        <Row>
          <LangIcon src={require(`assets/languages/${i18n.resolvedLanguage}.svg`)} />
          {languages[i18n.resolvedLanguage]}
        </Row>
        <DropdownIcon />
      </OptionButton>
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

const SmallText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  margin-bottom: 20px;
`;

const BackIcon = styled(BackIconDefault)`
  position: absolute;
  top: 34px;
  left: 11px;
  cursor: pointer;
  padding: 10px;
  @media only screen and (max-width: 560px) {
    top: 11px;
  }
`;

const Title = styled.span`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.bold};
`;

const LanguageButton = styled(OptionButton)`
  background-color: ${props => props.theme.walletConnectorOption.background[!props.$active ? 'default' : 'hover']};
  border: 1px solid ${props => props.theme.walletConnectorOption.border[!props.$active ? 'default' : 'hover']};
`;

const DropdownIcon = styled(DropdownIconDefault)`
  margin-left: 10px;
  transform: rotate(270deg);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const LangIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;
