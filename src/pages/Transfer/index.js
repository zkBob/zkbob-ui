import React from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';
import Input from 'components/Input';

const note = 'This transfer will happen within ZeroPool and will be truly private.';

export default () => {
  return (
    <Card title="Transfer" note={note}>
      <TransferInput />
      <Input placeholder="Enter ZeroPool address of receiver" />
      <Button gradient>Transfer</Button>
    </Card>
  );
};
