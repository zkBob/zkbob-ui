import styled from 'styled-components';

export default ({ value }) => (
  <SeedPhrase>
    {value.split(' ').map((word, index) =>
      <WordContainer key={index}>
        <Number>{index + 1}</Number>
        <Word>{word}</Word>
      </WordContainer>
    )}
  </SeedPhrase>
);

const SeedPhrase = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-bottom: 0;
`;

const WordContainer = styled.div`
  padding: 8px 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
  margin-right: 8px;
`;

const Word = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
`;

const Number = styled(Word)`
  color: ${({ theme }) => theme.text.color.secondary};
  margin-right: 7px;
`;
