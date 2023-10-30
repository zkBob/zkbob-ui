import { useState, useEffect } from 'react';

async function getUserCountry() {
  const apis = [
    'https://ipapi.co/json',
    'https://api.country.is',
  ];

  let country;
  for (const api of apis) {
    try {
      const res = await fetch(api);
      const data = await res.json();
      country = data.country;
      break;
    } catch (error) {
      console.error(error);
    }
  }
  if (!country) throw Error;

  return country;
}

export default () => {
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        if (window.location.host.includes(process.env.REACT_APP_DEV_HOST)) return;
        if (!process.env.REACT_APP_RESTRICTED_COUNTRIES) return;
        const RESTRICTED_COUNTRIES = process.env.REACT_APP_RESTRICTED_COUNTRIES.split(',');
        const country = await getUserCountry();
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
