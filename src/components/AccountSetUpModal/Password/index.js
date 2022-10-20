import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Input from 'components/Input';

export default ({ confirmPassword }) => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [lengthError, setLengthError] = useState(false);
  const [matchError, setMatchError] = useState(false);

  const handlePasswordChange = useCallback(e => {
    setLengthError(false);
    setMatchError(false);
    setPassword(e.target.value);
  }, []);

  const handlePasswordConfirmationChange = useCallback(e => {
    setLengthError(false);
    setMatchError(false);
    setPasswordConfirmation(e.target.value);
  }, []);

  const confirm = useCallback(() => {
    const lengthError = !password || password.length < 6;
    const matchError = password !== passwordConfirmation;
    setLengthError(lengthError);
    setMatchError(matchError);
    if (!lengthError && !matchError) {
      confirmPassword(password);
    }
  }, [password, passwordConfirmation, confirmPassword]);

  const handleKeyPress = useCallback(event => {
    if(event.key === 'Enter'){
      confirm();
    }
  }, [confirm]);

  return (
    <Container onKeyPress={handleKeyPress}>
      <Description>
        To enhance security, password entry is required each<br /> time a page reloads.
      </Description>
      <Input
        type="password"
        placeholder="Password 6+ characters"
        value={password}
        onChange={handlePasswordChange}
        error={lengthError || matchError}
      />
      <Input
        type="password"
        placeholder="Verify password"
        value={passwordConfirmation}
        onChange={handlePasswordConfirmationChange}
        error={lengthError || matchError}
      />
      <RulesContainer>
        <Rule $error={lengthError}>Please enter 6 or more characters</Rule>
        <Rule $error={matchError}>Password should match</Rule>
      </RulesContainer>
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
  font-size: 14px;
  color: ${({ theme }) => theme.text.color.secondary};
  line-height: 20px;
  text-align: center;
`;

const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 25px;
`;

const Rule = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color[props.$error ? 'error' : 'secondary']};
  position: relative;
  margin-bottom: 8px;
  &::before {
    content: ".";
    position: absolute;
    left: -12px;
    top: -10px;
    font-size: 20px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;
