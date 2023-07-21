import { createGlobalStyle } from 'styled-components';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

const GlobalStyle = createGlobalStyle`
  .dropdown {
    opacity: 1;
  }
`;

export default ({ children, content, disabled, width, placement, style = {}, isOpen, open, close, ...props }) => {
  return (
    <>
      <GlobalStyle />
      <Tooltip
        overlayClassName="dropdown"
        placement={placement || "bottomRight"}
        trigger={disabled ? [] : ['click']}
        overlay={content}
        showArrow={false}
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
        destroyTooltipOnHide={{ keepParent: true }}
        visible={isOpen}
        onVisibleChange={visible => visible ? open() : close()}
        {...props}
      >
        {children}
      </Tooltip>
    </>
  );
}
