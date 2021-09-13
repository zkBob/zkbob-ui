import React from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'Amount withdrawn from zero knowledge pool will be deposited to the selected account.';

export default () => {
  return (
    <Card title="Withdraw" note={note}>
      <TransferInput />
      <Button gradient>Withdraw</Button>
    </Card>
  );
};
