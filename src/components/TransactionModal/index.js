import React from 'react';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import Modal from 'components/Modal';
import Spinner from 'components/Spinner';
import Button from 'components/Button';
import Link from 'components/Link';

import { TX_STATUSES, NETWORKS, SUPPORT_URL } from 'constants';

import { ReactComponent as CheckIconDefault } from 'assets/check-circle.svg';
import { ReactComponent as CrossIconDefault } from 'assets/cross-circle.svg';
import { ReactComponent as CsvFileIcon} from 'assets/csv-file.svg';

import { formatNumber } from 'utils';

const titles = {
  [TX_STATUSES.APPROVE_TOKENS]: 'approveTokens',
  [TX_STATUSES.APPROVED]: 'approved',
  [TX_STATUSES.SIGN_MESSAGE]: 'signMessage',
  [TX_STATUSES.CONFIRM_TRANSACTION]: 'confirmTransaction',
  [TX_STATUSES.WAITING_FOR_TRANSACTION]: 'waitingForTransaction',
  [TX_STATUSES.GENERATING_PROOF]: 'generatingProof',
  [TX_STATUSES.WAITING_FOR_RELAYER]: 'waitingForRelayer',
  [TX_STATUSES.DEPOSITED]: 'deposited',
  [TX_STATUSES.TRANSFERRED]: 'transferred',
  [TX_STATUSES.TRANSFERRED_MULTI]: 'transferredMulti',
  [TX_STATUSES.WITHDRAWN]: 'withdrawn',
  [TX_STATUSES.REJECTED]: 'rejected',
  [TX_STATUSES.SIGNATURE_EXPIRED]: 'signatureExpired',
  [TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT]: 'suspiciousAccountDeposit',
  [TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL]: 'suspiciousAccountWithdrawal',
  [TX_STATUSES.WRONG_NETWORK]: 'wrongNetwork',
  [TX_STATUSES.SWITCH_NETWORK]: 'switchNetwork',
  [TX_STATUSES.SENT]: 'sent',
  [TX_STATUSES.PREPARING_TRANSACTION]: 'preparingTransaction',
};

const useDescriptions = () => {
  const { t } = useTranslation();
  return {
    [TX_STATUSES.DEPOSITED]: ({ amount, currentPool }) => (
      <Trans
        i18nKey="transactionModal.descriptions.deposited"
        values={{
          amount: formatNumber(amount, currentPool.tokenDecimals, 18),
          symbol: currentPool.tokenSymbol,
        }}
      />
    ),
    [TX_STATUSES.TRANSFERRED]: ({ amount, currentPool }) => (
      <Trans
        i18nKey="transactionModal.descriptions.transferred"
        values={{
          amount: formatNumber(amount, currentPool.tokenDecimals, 18),
          symbol: currentPool.tokenSymbol,
        }}
      />
    ),
    [TX_STATUSES.TRANSFERRED_MULTI]: ({ amount, currentPool }) => (
      <Trans
        i18nKey="transactionModal.descriptions.transferredMulti"
        values={{
          amount: formatNumber(amount, currentPool.tokenDecimals, 18),
          symbol: currentPool.tokenSymbol,
        }}
      />
    ),
    [TX_STATUSES.WITHDRAWN]: ({ amount, currentPool }) => (
      <Trans
        i18nKey="transactionModal.descriptions.withdrawn"
        values={{
          amount: formatNumber(amount, currentPool.tokenDecimals, 18),
          symbol: currentPool.tokenSymbol,
        }}
      />
    ),
    [TX_STATUSES.SIGNATURE_EXPIRED]: () => t('transactionModal.descriptions.signatureExpired'),
    [TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT]: () => t('transactionModal.descriptions.suspiciousAccountDeposit'),
    [TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL]: () => t('transactionModal.descriptions.suspiciousAccountWithdrawal'),
    [TX_STATUSES.WRONG_NETWORK]: ({ currentPool }) =>
      t('transactionModal.descriptions.wrongNetwork', {
        network: NETWORKS[currentPool.chainId].name
      }),
    [TX_STATUSES.APPROVED]: () => t('transactionModal.descriptions.approved'),
    [TX_STATUSES.SENT]: ({ currentPool, txHash, csvLink }) => (
      <Trans
        i18nKey="transactionModal.descriptions.sent"
        components={{
          1: <Link href={NETWORKS[currentPool.chainId].blockExplorerUrls.tx.replace('%s', txHash)} />,
          2: <DownloadLink href={csvLink} download={`payment_statement_${txHash}.csv`} />,
          3: <CsvFileIcon style={{ marginRight: 12 }} />,
        }}
      />
    ),
  };
};

const SUCCESS_STATUSES = [
  TX_STATUSES.DEPOSITED,
  TX_STATUSES.TRANSFERRED,
  TX_STATUSES.TRANSFERRED_MULTI,
  TX_STATUSES.WITHDRAWN,
  TX_STATUSES.APPROVED,
  TX_STATUSES.SENT,
];
const FAILURE_STATUSES = [
  TX_STATUSES.REJECTED,
  TX_STATUSES.SIGNATURE_EXPIRED,
  TX_STATUSES.WRONG_NETWORK,
];
const SUSPICIOUS_ACCOUNT_STATUSES = [
  TX_STATUSES.SUSPICIOUS_ACCOUNT_DEPOSIT,
  TX_STATUSES.SUSPICIOUS_ACCOUNT_WITHDRAWAL,
];

export default ({ isOpen, onClose, status, amount, error, supportId, currentPool, txHash, csvLink }) => {
  const { t } = useTranslation();
  const descriptions = useDescriptions();
  return (
    <Modal
      isOpen={isOpen}
      onClose={[
        ...SUCCESS_STATUSES,
        ...FAILURE_STATUSES,
        ...SUSPICIOUS_ACCOUNT_STATUSES,
      ].includes(status) ? onClose : null}
      title={t(`transactionModal.titles.${titles[status]}`)}
    >
      {status === TX_STATUSES.SIGN_MESSAGE && (
        <SignDescription>
          {t('transactionModal.descriptions.signMessage')}
        </SignDescription>
      )}
      {(() => {
        if (SUCCESS_STATUSES.includes(status)) return <CheckIcon />
        else if (FAILURE_STATUSES.includes(status)) return <CrossIcon />
        else if (SUSPICIOUS_ACCOUNT_STATUSES.includes(status)) return null
        else return <Spinner />;
      })()}
      {descriptions[status] && (
        <Description>{descriptions[status]({ amount, currentPool, txHash, csvLink })}</Description>
      )}
      {(status === TX_STATUSES.REJECTED && error) && (
        <Description>{error}</Description>
      )}
      {(FAILURE_STATUSES.includes(status)) && (
        <>
          <Description style={{ marginBottom: 8 }}>{t('common.supportId')}: {supportId}</Description>
          <Link href={SUPPORT_URL}>
            {t('common.contactSupport')}
          </Link>
        </>

      )}
      {status === TX_STATUSES.DEPOSITED && (
        <OkButton onClick={onClose}>
          {t('buttonText.gotIt')}
        </OkButton>
      )}
      {SUSPICIOUS_ACCOUNT_STATUSES.includes(status) && (
        <OkButton onClick={onClose}>
          {t('buttonText.okay')}
        </OkButton>
      )}
    </Modal>
  );
};

const Description = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text.color.secondary};
  text-align: center;
  line-height: 20px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
  & > strong {
    font-weight: ${({ theme }) => theme.text.weight.bold};
  }
`;

const SignDescription = styled(Description)`
  margin-top: -10px;
`;

const OkButton = styled(Button)`
  width: 100%;
`;

const CheckIcon = styled(CheckIconDefault)`
  margin-bottom: 16px;
`;

const CrossIcon = styled(CrossIconDefault)`
  margin-bottom: 16px;
`;

const DownloadLink = styled(Link)`
  display: inline-flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  height: 36px;
  padding: 0px 16px;
  border-radius: 18px;
  border: 1px solid var(--buttons-blue-n-2, rgba(22, 67, 206, 0.90));
  color: var(--buttons-blue-n-2, rgba(22, 67, 206, 0.90));
  font-size: 16px;
  margin-top: 16px;
`;
