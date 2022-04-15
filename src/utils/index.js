export const shortAddress = (string, length = 10) =>
  string.substring(0, length - 4) + '...' + string.substring(string.length - 4);

export const formatNumber = (number, decimals = 2) =>
  Math.trunc(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
