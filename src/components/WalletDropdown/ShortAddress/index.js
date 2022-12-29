import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

function calculateMaxCharCount(tempText, string, parentWidth, fromEnd) {
  let charCount = 0;
  let stringWidth = 0;
  for (let i = 0; i < string.length; i++) {
    if (fromEnd) {
      tempText.textContent = string.substring(string.length - (i + 1));
    } else {
      tempText.textContent = string.substring(0, i + 1);
    }
    stringWidth = tempText.offsetWidth;
    if (stringWidth > parentWidth) break;
    charCount++;
  }
  return charCount;
}

export default ({ address }) => {
  const parentElement = useRef(null);
  const [stringParts, setStringParts] = useState(['', '']);

  useEffect(() => {
    // Create a temporary text element to measure the length of the string
    const tempText = document.createElement('span');
    tempText.style.visibility = 'hidden';
    tempText.style.whiteSpace = 'nowrap';
    tempText.style.fontSize = '20px';
    document.body.appendChild(tempText);

    tempText.textContent = '...';
    const dotsWidth = tempText.offsetWidth;

    // Measure the width of the parent element
    const maxPartWidth = (parentElement.current.offsetWidth - dotsWidth) / 2;

    // Calculate the maximum number of characters that can fit in each part of the string
    const halfStringLength = address.length / 2;
    const part1 = address.substring(0, halfStringLength);
    const part2 = address.substring(halfStringLength);
    const maxCharCount1 = calculateMaxCharCount(tempText, part1, maxPartWidth);
    const maxCharCount2 = calculateMaxCharCount(tempText, part2, maxPartWidth, true);

    setStringParts([
      `${part1.substring(0, maxCharCount1)}`,
      `${part2.substring(part2.length - maxCharCount2)}`
    ]);

    // Remove the temporary text element
    document.body.removeChild(tempText);
  }, [parentElement?.current?.offsetWidth, address]);

  return (
    <Address ref={parentElement}>
      {stringParts[0]}...{stringParts[1]}
    </Address>
  );
};

const Address = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.default};
  margin: 0 8px;
  flex: 1;
`;
