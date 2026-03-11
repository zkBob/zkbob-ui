import React from 'react';
import styled from 'styled-components';

export default ({ header, footer, children }) => (
  <>
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
  padding: 21px 40px 40px;
  background: ${props => props.theme.background};
  @media only screen and (max-width: 560px) {
    padding: 21px 7px 28px;
  }
  @media only screen and (max-width: 800px) {
    padding-bottom: 80px;
  }
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
