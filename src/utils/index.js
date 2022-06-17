import moment from 'moment';

export const shortAddress = (string, length = 10) =>
  string.substring(0, length - 4) + '...' + string.substring(string.length - 4);

export const formatNumber = (number) => {
  if (number > 0) {
    if (number > 0.0001) {
      let decimals = number > 1 ? 2 : 4;
      return Math.trunc(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
    return '≈ 0'
  }
  return 0;
}

export const formatDateFromNow = timestamp => {
  const now = moment();
  const time = moment(timestamp * 1000);
  const days = now.diff(time, 'days');
  const hours = now.diff(time, 'hours');
  const minutes = now.diff(time, 'minutes');
  const seconds = now.diff(time, 'seconds');

  if (days > 0) {
    return time.format('MMM D, YYYY');
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return `${seconds}s ago`;
  }
}
