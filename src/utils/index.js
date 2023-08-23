import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

import LinkDefault from 'components/Link';

import { SUPPORT_URL } from 'constants';

const { parseUnits, formatUnits, commify } = ethers.utils;

export const shortAddress = (string, length = 10) =>
  string.substring(0, length - 4) + '...' + string.substring(string.length - 4);

export const formatNumber = (wei, tokenDecimals, customNumberDecimals) => {
  if (wei.isZero()) return '0';
  if (wei.lte(parseUnits('0.0001', tokenDecimals))) return '≈ 0';

  const numberDecimals = typeof customNumberDecimals === 'number'
    ? customNumberDecimals
    : (wei.gt(parseUnits('1', tokenDecimals)) ? 2 : 4);
  const formatted = commify(formatUnits(wei, tokenDecimals));
  let [prefix, suffix] = formatted.split('.');
  if (suffix === '0' || numberDecimals === 0) {
    suffix = '';
  } else {
    suffix = '.' + suffix.slice(0, numberDecimals);
  }
  return prefix + suffix;
};

export const minBigNumber = (...numbers) =>
  numbers.reduce((p, v) =>  (p.lt(v) ? p : v));

export const maxBigNumber = (...numbers) =>
  numbers.reduce((p, v) =>  (p.gt(v) ? p : v));

export const showLoadingError = cause => {
  toast.error(
    <span>
      <b><Trans i18nKey={`loadingError.titles.${cause}`} /></b><br />
      <Trans i18nKey={`loadingError.description`} components={{ 1: <Link href={SUPPORT_URL} /> }} />
    </span>
  );
};

const Link = styled(LinkDefault)`
  color: inherit;
  text-decoration: underline;
`;
