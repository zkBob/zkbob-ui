import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from 'components/Button';

export default ({ text, style, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = useCallback((text, result) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, []);

  return isCopied ? (
    <Text style={style}>Copied!</Text>
  ) : (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <LinkButton type="link" style={style}>
        {children}
      </LinkButton>
    </CopyToClipboard>
  );
}

const LinkButton = styled(Button)`
  font-size: 16px;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.color.secondary};
`;
