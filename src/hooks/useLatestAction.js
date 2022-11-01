import { useState, useEffect, useContext } from 'react';

import { ZkAccountContext } from 'contexts';

export default actionType => {
  const { history } = useContext(ZkAccountContext);
  const [latestAction, setLatestAction] = useState(null);

  useEffect(() => {
    let latestAction = null;
    if (history?.length) {
      latestAction = history.find(item => item.type === actionType);
    }
    setLatestAction(latestAction);
  }, [history, actionType]);

  return latestAction;
};
