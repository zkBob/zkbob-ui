import styled from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default ({ width }) => (
  <SkeletonTheme
    baseColor="#eae0df"
    highlightColor="#c9c8cc"
    width={width}
    height={6}
  >
    <Skeleton style={{ zIndex: 0 }} wrapper={Container} />
  </SkeletonTheme>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  line-height: inherit;
`;
