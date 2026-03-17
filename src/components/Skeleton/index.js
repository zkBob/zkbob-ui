import styled from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default ({ width, style }) => (
  <SkeletonTheme
    baseColor="rgba(83, 83, 211, 0.1)"
    highlightColor="rgba(83, 83, 211, 0.2)"
    width={width}
    height={6}
  >
    <Skeleton style={{ zIndex: 0, ...style }} wrapper={Container} />
  </SkeletonTheme>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  line-height: inherit;
`;
