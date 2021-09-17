export const shortAddress = (string, length = 10) =>
  string.substring(0, length - 4) + '...' + string.substring(string.length - 4);
