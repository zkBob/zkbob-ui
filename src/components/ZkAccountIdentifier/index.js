
import React from 'react';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/pixel-art';

export default ({ seed, size }) => {
  return <img style={{ height: size }} src={createAvatar(style, { seed: seed, dataUri: true })} />;
};
