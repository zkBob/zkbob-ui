import { createContext, useState, useEffect } from 'react';
import * as Sentry from "@sentry/react";
import { v4 as uuidv4 } from 'uuid';

const SupportIdContext = createContext({ supportId: null });

export default SupportIdContext;

export const SupportIdContextProvider = ({ children }) => {
  const [supportId, setSupportId] = useState(null);

  useEffect(() => {
    setSupportId(uuidv4());
  }, []);

  useEffect(() => {
    Sentry.configureScope(scope => {
      scope.setTag('support_id', supportId);
    });
  }, [supportId]);

  return (
    <SupportIdContext.Provider value={{ supportId }}>
      {children}
    </SupportIdContext.Provider>
  );
};
