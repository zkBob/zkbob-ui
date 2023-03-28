import { createContext, useState, useEffect, useCallback } from 'react';
import * as Sentry from "@sentry/react";
import { v4 as uuidv4 } from 'uuid';

const SupportIdContext = createContext({ supportId: null });

export default SupportIdContext;

export const SupportIdContextProvider = ({ children }) => {
  const [supportId, setSupportId] = useState(null);

  const updateSupportId = useCallback(() => {
    setSupportId(uuidv4());
  }, []);

  useEffect(() => {
    updateSupportId();
  }, [updateSupportId]);

  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setTag('support_id', supportId);
    });
  }, [supportId]);

  useEffect(() => {
    async function getIpAddress() {
      try {
        const data = await (await fetch('https://ipapi.co/json')).json();
        Sentry.configureScope(scope => {
          scope.setTag('ip', data.ip);
        });
      } catch (error) {
        console.error('Failed to get IP.');
      }
    }
    getIpAddress();
  }, []);

  return (
    <SupportIdContext.Provider value={{ supportId, updateSupportId }}>
      {children}
    </SupportIdContext.Provider>
  );
};
