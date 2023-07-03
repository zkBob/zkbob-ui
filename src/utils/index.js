import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const { parseEther, formatEther, commify } = ethers.utils;

export const shortAddress = (string, length = 10) =>
  string.substring(0, length - 4) + '...' + string.substring(string.length - 4);

export const formatNumber = (wei, customDecimals) => {
  if (wei.isZero()) return '0';
  if (wei.lte(parseEther('0.0001'))) return '≈ 0';

  const decimals = typeof customDecimals === 'number' ? customDecimals : (wei.gt(parseEther('1')) ? 2 : 4);
  const formatted = commify(formatEther(wei));
  let [prefix, suffix] = formatted.split('.');
  if (suffix === '0' || decimals === 0) {
    suffix = '';
  } else {
    suffix = '.' + suffix.slice(0, decimals);
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
      <b>Error loading {cause}.</b><br />
      Please try again later or contact our support if the issue persists.
    </span>
  );
};
