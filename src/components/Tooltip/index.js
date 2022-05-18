import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

export default ({ children, content, placement = 'left', delay = 0.5, ...props }) => (
  <Tooltip
    placement={placement}
    overlay={content}
    showArrow={false}
    mouseEnterDelay={delay}
    overlayInnerStyle={{
      minHeight: 0,
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: '#2A1B5B'
    }}
    {...props}
  >
    {children}
  </Tooltip>
);
