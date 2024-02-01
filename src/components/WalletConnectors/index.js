import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { isAndroid } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

import Link from 'components/Link';

import { WalletContext } from 'contexts';

import { CONNECTORS_ICONS } from 'constants';

export default ({ callback, gaIdPrefix = '', showAll = false }) => {
  const { t } = useTranslation();
  const { isTron, evmWallet, tronWallet, noWalletInstalled, isMobileTronLink } = useContext(WalletContext);

  const connectors = useMemo(() => {
    if (showAll && isTron) return [...tronWallet.connectors, ...evmWallet.connectors];
    if (showAll) return [...evmWallet.connectors, ...tronWallet.connectors];
    if (isTron) return tronWallet.connectors;
    return evmWallet.connectors;
  }, [showAll, isTron, evmWallet, tronWallet]);

  const connectWallet = useCallback(async connector => {
    if (!connector.isTron && connector.id === evmWallet.connector?.id) {
      await evmWallet.disconnect();
    }
    const { connect } = connector.isTron ? tronWallet : evmWallet;
    await connect({ connector });
    callback?.(connector);
  }, [callback, evmWallet, tronWallet]);

  const openDeepLink = e => {
    e.preventDefault();

    let isAppOpened = false;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAppOpened = true;
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    const deepLinkParams = {
      // 'url': window.location.origin,
      'action': 'open',
      'protocol': 'tronlink',
      'version': '1.0',
    };
    const deepLink = `tronlinkoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(deepLinkParams))}`;

    if (isAndroid) {
        // Use an iframe for Android
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = deepLink;
        document.body.appendChild(iframe);
    } else {
        // Use window.location for other platforms (like iOS)
        window.location = deepLink;
    }

    // Redirect to the app store after a timeout
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
      if (!isAppOpened) {
        if (window.confirm(t('connectWalletModal.downloadQuestion'))) {
          // Redirect to the Play Store for Android, App Store for iOS
          window.location = isAndroid
              ? 'https://play.google.com/store/apps/details?id=com.tronlink.global'
              : 'https://apps.apple.com/app/id1453530188';
        }
      }
    }, 2000);
  };

  return (noWalletInstalled && !showAll) ? (
    <InstallWalletLink
      href={isMobileTronLink ? undefined : 'https://www.tronlink.org/'}
      onClick={isMobileTronLink ? openDeepLink : undefined}
    >
      <WalletConnectorName>
        {t(`connectWalletModal.${isMobileTronLink ? 'open' : 'install'}`, { wallet: 'TronLink' })}
      </WalletConnectorName>
      <WalletConnectorIcon src={require('assets/tronlink.png')} />
    </InstallWalletLink>
  ) : (
    <>
      {connectors.map((connector, index) => connector.ready &&
        <WalletConnector
          key={index}
          onClick={() => connectWallet(connector)}
          data-ga-id={gaIdPrefix + connector.name}
        >
          <WalletConnectorName>{connector.name}</WalletConnectorName>
          <WalletConnectorIcon src={CONNECTORS_ICONS[connector.name]} />
        </WalletConnector>
      )}
    </>
  );
};

const WalletConnector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.walletConnectorOption.background.default};
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.hover};
  }
`;

const InstallWalletLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.walletConnectorOption.background.default};
  border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.default};
  border-radius: 16px;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.walletConnectorOption.background.hover};
    border: 1px solid ${({ theme }) => theme.walletConnectorOption.border.hover};
  }
`;

const WalletConnectorName = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.text.color.primary};
  font-weight: ${({ theme }) => theme.text.weight.normal};
`;

const WalletConnectorIcon = styled.img`
  width: 32px;
`;
