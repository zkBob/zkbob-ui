import React from 'react';
import Switch from 'react-switch';

export default props => (
  <Switch
    {...props}
    checkedIcon={false}
    uncheckedIcon={false}
    handleDiameter={16}
    height={20}
    width={36}
    onColor="#3182CE"
    offColor="#CBD5E0"
  />
);
