import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Input from 'components/Input';

export default ({ confirmPassword }) => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const handlePasswordChange = useCallback(e => {
    setError(null);
    setPassword(e.target.value);
  }, []);
  const handlePasswordConfirmationChange = useCallback(e => {
    setError(null);
    setPasswordConfirmation(e.target.value);
  }, []);
  const confirm = useCallback(() => {
    if (!password || password.length < 6 || password !== passwordConfirmation) {
      setError('Wrong password');
    } else {
      confirmPassword(password);
    }
  }, [password, passwordConfirmation, confirmPassword]);
  return (
    <Container>
      <Description>
        To enhance security, password entry is required each<br /> time a page reloads.
      </Description>
      <Input
        type="password"
        placeholder="Password 6+ characters"
        value={password}
        onChange={handlePasswordChange}
        error={!!error}
      />
      <Input
        type="password"
        placeholder="Verify password"
        value={passwordConfirmation}
        onChange={handlePasswordConfirmationChange}
        error={!!error}
      />
      <Button onClick={confirm}>Verify</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  & > * {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Description = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;
