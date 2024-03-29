import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import QrReader from 'react-qr-scanner'

import { ReactComponent as CrossIconDefault } from 'assets/cross.svg';

export default ({ onResult, children }) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = data => {
    if (!data) return;
    onResult(data.text);
    setShowScanner(false);
  }

  return (
    <>
      {React.cloneElement(children, {
        onClick: e => {
          e.stopPropagation();
          setShowScanner(true);
        }
      })}
      {createPortal((
        <>
          {showScanner && (
            <ScannerContainer onClick={e => e.stopPropagation()}>
              <CrossIcon onClick={() => setShowScanner(false)} />
              <QrReader
                constraints={{
                  audio: false,
                  video: {
                    facingMode: 'environment',
                  },
                }}
                onScan={handleScan}
                onError={error => console.log(error)}
                style={{ width: 300 }}
              />
            </ScannerContainer>
          )}
        </>
      ), document.getElementById('root'))}
    </>
  );
};

const CrossIcon = styled(CrossIconDefault)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  path {
    fill: #FFF;
  }
`;

const ScannerContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
`;
