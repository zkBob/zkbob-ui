import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ZkAccountContext } from 'contexts';

import Button from 'components/Button';

export default () => {
  const { t } = useTranslation();
  const { loadingPercentage } = useContext(ZkAccountContext);
  return (
    <Button contrast disabled loading>
      {loadingPercentage === null
        ? t('buttonText.loading')
        : t('buttonText.loadingPercentage', { percentage: Math.floor(loadingPercentage * 100) })
      }
    </Button>
  );
}
