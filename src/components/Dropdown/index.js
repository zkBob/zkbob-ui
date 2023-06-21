import { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const GlobalStyle = createGlobalStyle`
  .dropdown {
    top: 55px !important;
    @media only screen and (max-width: 560px) {
      left: calc(100% - 58px) !important;
      transform: translateX(-100%) !important;
    }
    @media only screen and (max-width: 480px) {
      left: 50% !important;
      transform: translateX(-50%) !important;
    }
  }
`;

export default ({ children, content, disabled, width, placement, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <GlobalStyle />
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
        }}
        overlayStyle={{
          opacity: isVisible ? 1 : 0,
        }}
        destroyTooltipOnHide={{ keepParent: true }}
        {...props}
      >
        {children}
      </Tooltip>
    </>
  );
}
