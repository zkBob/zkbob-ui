import styled, { createGlobalStyle } from 'styled-components';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

import { ReactComponent as CrossIconDefault } from 'assets/cross.svg';

const GlobalDropdownStyle = createGlobalStyle`
  .rc-tooltip {
    opacity: 1;
  }
  .dropdown-fullscreen {
    @media only screen and (max-width: 560px) {
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      padding: 0 !important;
      height: 100dvh !important;

      .rc-tooltip-content {
        height: 100% !important;
      }

      .rc-tooltip-inner {
        width: 100% !important;
        height: 100% !important;
        border-radius: 0 !important;
        overflow-y: scroll !important;
        padding-top: 50px !important;

        & > div {
          min-height: 100% !important;
          justify-content: center !important;
        }
      }
    }
  }
`;

const GlobalBodyFullscreenStyle = createGlobalStyle`
  body {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
`;

export default ({
  children, content, disabled, width, placement,
  style = {}, isOpen, open, close, fullscreen = true, ...props
}) => {
  return (
    <>
      <GlobalDropdownStyle />
      {fullscreen && isOpen && <GlobalBodyFullscreenStyle />}
      <Tooltip
        overlayClassName={fullscreen ? 'dropdown-fullscreen' : ''}
        placement={placement || "bottomRight"}
        trigger={disabled ? [] : ['click']}
        overlay={() => (
          <>
            {fullscreen && <CrossIcon onClick={close} />}
            {content()}
          </>
        )}
        showArrow={false}
        overlayInnerStyle={{
          minHeight: 0,
          padding: '26px 24px',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          width: width || 370,
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

const CrossIcon = styled(CrossIconDefault)`
  display: none;
  position: absolute;
  top: 11px;
  right: 11px;
  cursor: pointer;
  padding: 10px;
  @media only screen and (max-width: 560px) {
    display: block;
  }
`;
