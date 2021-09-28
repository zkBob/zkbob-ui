import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import connectors from 'connectors';

export default () => {
  const { connector } = useWeb3React();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let selected = null;
    if (connector) {
      selected = Object.values(connectors).find(con =>
        con.connector.constructor === connector.constructor
      );
    }
    setSelected(selected);
  }, [connector]);

  return selected;
};
