import styled from 'styled-components';

import Link from 'components/Link';

import { ReactComponent as LinkIcon } from 'assets/external-link.svg';

export default props => (
  props.type === 'link' ? (
    <ButtonLink {...props}>{props.children}<LinkIcon /></ButtonLink>
  ) : (
    <ButtonLink as="button" {...props}>{props.children}</ButtonLink>
  )
);

const ButtonLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.walletConnectorOption.background.default};
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.hover};
  }
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.normal};
`;
