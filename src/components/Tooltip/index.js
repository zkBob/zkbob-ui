import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

export default ({ children, content, placement = 'left', delay = 0.5, style, ...props }) => (
  <Tooltip
    placement={placement}
    overlay={content}
    mouseEnterDelay={delay}
    overlayInnerStyle={{
      minHeight: 0,
      fontSize: '14px',
      lineHeight: '16px',
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: '#2A1B5B',
      width: props.width,
      ...style,
    }}
    {...props}
  >
    {children}
  </Tooltip>
);
