import React from 'react';
import styled from 'styled-components';

export default ({ header, footer, children }) => (
  <>
    <Gradient />
    <Layout>
      {header}
      <PageContainer>
        {children}
      </PageContainer>
      {footer}
    </Layout>
  </>
);

const Layout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 14px 40px 40px;
  background: linear-gradient(180deg, #FBEED0 0%, #FAFAF9 78.71%);
  @media only screen and (max-width: 560px) {
    padding: 21px 7px 28px;
  }
  @media only screen and (max-width: 800px) {
    padding-bottom: 80px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 80px 0;
  position: relative;
  @media only screen and (max-width: 560px) {
    margin: 30px 0;
  }
`;

const Gradient = styled.div`
  position: absolute;
  width: 544px;
  height: 585.08px;
  left: calc(50% - 270px);
  top: 100px;
  background: linear-gradient(211.28deg, #F7C23B 19.66%, rgba(232, 110, 255, 0.5) 57.48%, rgba(255, 255, 255, 0.5) 97.74%);
  background: -moz-linear-gradient(231.28deg, rgba(247, 194, 59, 0.2) 19.66%, rgba(232, 110, 255, 0.2) 57.48%, rgba(255, 255, 255, 0.5) 97.74%);
  filter: blur(250px);
  transform: rotate(27.74deg) translate3d(0,0,0);
`;
