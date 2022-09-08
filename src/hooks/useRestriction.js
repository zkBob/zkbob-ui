import { useState, useEffect } from 'react';

export default () => {
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const RESTRICTED_COUNTRIES = process.env.REACT_APP_RESTRICTED_COUNTRIES.split(',');
        const country = await (await fetch('https://ipapi.co/country')).text();
        if (RESTRICTED_COUNTRIES.includes(country)) {
          setIsRestricted(true);
        }
      } catch (error) {
        console.error('Failed to get country by IP.');
      }
    }
    check();
  }, []);

  return isRestricted;
};
