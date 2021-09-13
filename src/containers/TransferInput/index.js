import React, { useState } from 'react';

import TransferInput from 'components/TransferInput';

export default ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState(0);
  return (
    <TransferInput tokens={tokens} selectedToken={selectedToken} onTokenSelect={setSelectedToken} />
  );
};
