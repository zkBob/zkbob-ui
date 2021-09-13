import React from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';

const note = 'This transfer will happen within ZeroPool and will be truly private.';

export default () => {
  return (
    <Card title="Transfer" note={note}>
      <TransferInput />
      <Button gradient>Transfer</Button>
    </Card>
  );
};
