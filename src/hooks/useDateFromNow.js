import { useState, useCallback, useEffect } from 'react';
import moment from 'moment';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default timestamp => {
  const [date, setDate] = useState(null);
  const [interval, setInterval] = useState(SECOND);

  const update = useCallback(() => {
    const now = moment();
    const time = moment(timestamp * 1000);
    const days = now.diff(time, 'days');
    const hours = now.diff(time, 'hours');
    const minutes = now.diff(time, 'minutes');
    const seconds = now.diff(time, 'seconds');
    let date;
    let interval;
    if (days > 0) {
      date = time.format('MMM D, YYYY');
      interval = HOUR;
    } else if (hours > 0) {
      date = `${hours}h ago`;
      interval = MINUTE;
    } else if (minutes > 0) {
      date = `${minutes}m ago`;
      interval = SECOND * 5;
    } else {
      date = `${seconds}s ago`;
      interval = SECOND;
    }
    setDate(date);
    setInterval(interval);
  }, [timestamp]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    const intervalId = window.setInterval(update, interval);
    return () => clearInterval(intervalId);
  }, [update, interval]);

  return date;
}
