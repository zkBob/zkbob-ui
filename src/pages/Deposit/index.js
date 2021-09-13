import React from 'react';

import TransferInput from 'containers/TransferInput';

import Card from 'components/Card';
import Button from 'components/Button';

import ethIcon from 'assets/eth.svg';
import zpEthIcon from 'assets/zp-eth.svg';

const tokens = [
  { name: 'ETH', icon: ethIcon },
  { name: 'zpETH', icon: zpEthIcon },
];

const note = 'Eth from your account will be deposited to your ZeroPool address via relayer';

export default () => {
  return (
    <Card title="Deposit" note={note}>
      <TransferInput tokens={tokens} />
      <Button gradient>Deposit</Button>
    </Card>
  );
};
