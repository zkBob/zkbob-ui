import React from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'Eth from your account will be deposited to your ZeroPool address via relayer.';

export default () => {
  return (
    <Card title="Deposit" note={note}>
      <TransferInput />
      <Button gradient>Deposit</Button>
    </Card>
  );
};
