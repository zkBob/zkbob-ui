import React from 'react';

import { Banner, BannerText } from 'components/BannerWithCountdown';

export default () => (
  <Banner>
    <BannerText>All zkBob pools are deprecated due to discovered vulnerability. Deposits and transfers are disabled. Submitted withdrawals will be processed manually in batches within 1-2 weeks.</BannerText>
  </Banner>
);
