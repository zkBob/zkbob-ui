
import React from 'react';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/pixel-art';
const { uniqueNamesGenerator, names } = require('unique-names-generator');

export const ZkAvatar = ({ seed, size, ...props }) =>
  <img {...props} style={{ height: size }} src={createAvatar(style, { seed: seed, dataUri: true })} />;

export const ZkName = ({ seed, ...props }) =>
  <span {...props}>zk{uniqueNamesGenerator({ dictionaries: [names], seed })}</span>;
