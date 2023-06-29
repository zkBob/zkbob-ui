import { useCallback } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import OptionButton from 'components/OptionButton';

const links = [
  { name: 'Dune Analytics', href: 'https://dune.com/zkbob/zkbob' },
  { name: 'Documentation', href: 'https://docs.zkbob.com/' },
  { name: 'Linktree', href: 'https://linktr.ee/zkbob' },
];

const Content = ({ buttonRef, openSwapModal, currentPool }) => {
  const onClick = useCallback(() => {
    openSwapModal();
    buttonRef.current.click();
  }, [buttonRef, openSwapModal]);

  return (
    <Container>
      <Title>More about zkBob</Title>
      <SwapButton onClick={onClick}>
        Get {currentPool.tokenSymbol}
      </SwapButton>
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
}

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

const SwapButton = styled(OptionButton)`
  background: ${props => props.theme.button.link.text.color};
  color: ${props => props.theme.button.primary.text.color.default};
  border: 0;
  display: none;
  @media only screen and (max-width: 1000px) {
    display: flex;
  }
`;
