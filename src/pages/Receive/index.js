import React, { useState, useContext, useCallback } from 'react';

import { ZkAccountContext } from 'contexts';

import Card from 'components/Card';
import PrivateAddress from 'components/PrivateAddress';

const note = 'This address should be used to receive tokens within the pool';

export default () => {
  const { generateAddress } = useContext(ZkAccountContext);
  return (
    <Card title="Receive" note={note}>
      <PrivateAddress>
        {generateAddress()}
      </PrivateAddress>
    </Card>
  );
};
