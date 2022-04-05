import React, { useContext, useState, useCallback } from 'react';

import { ZkAccountContext } from 'contexts';

import AccountSetUpButton from 'containers/AccountSetUpButton';

import Card from 'components/Card';
import PrivateAddress from 'components/PrivateAddress';
import Button from 'components/Button';

const note = 'This address should be used to receive tokens within the pool';

export default () => {
  const { zkAccount, generateAddress, isLoadingState } = useContext(ZkAccountContext);
  const [privateAddress, setPrivateAddress] = useState(null);
  const generate = useCallback(() => {
    setPrivateAddress(generateAddress());
  }, [generateAddress]);
  return (
    <Card title="Receive private transaction" note={note}>
      {zkAccount ? (
        privateAddress ? (
          <PrivateAddress>{privateAddress}</PrivateAddress>
        ) : (
          isLoadingState ? (
            <Button disabled>Loading zero pool state...</Button>
          ) : (
            <Button gradient onClick={generate}>Generate private address</Button>
          )
        )
      ) : (
        <AccountSetUpButton />
      )}
    </Card>
  );
};
