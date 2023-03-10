import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default ({ width }) => (
  <SkeletonTheme
    baseColor="#eae0df"
    highlightColor="#c9c8cc"
    width={width}
    height={6}
  >
    <Skeleton style={{ top: -2 }} />
  </SkeletonTheme>
);
