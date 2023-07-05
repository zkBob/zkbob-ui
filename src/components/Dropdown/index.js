import { useState } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

export default ({ children, content, disabled, width, placement, style = {}, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Tooltip
      overlayClassName="dropdown"
      placement={placement || "bottomRight"}
      trigger={disabled ? [] : ['click']}
      overlay={content}
      showArrow={false}
      onPopupAlign={() => {
        setIsVisible(true);
      }}
      overlayInnerStyle={{
        minHeight: 0,
        padding: '26px 24px',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        width: width || 370,
        maxWidth: 'calc(100vw - 10px)',
        boxSizing: 'border-box',
        boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
      overlayStyle={{
        opacity: isVisible ? 1 : 0,
      }}
      destroyTooltipOnHide={{ keepParent: true }}
      {...props}
    >
      {children}
    </Tooltip>
  );
}
