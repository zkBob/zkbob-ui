export const shortAddress = (string, length = 10) =>
  string.substring(0, length - 4) + '...' + string.substring(string.length - 4);

export const formatNumber = (number) => {
  if (number > 0) {
    if (number > 0.0001) {
      let decimals = number > 1 ? 2 : 4;
      return (Math.trunc(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toLocaleString('en-US');
    }
    return '≈ 0'
  }
  return 0;
}
