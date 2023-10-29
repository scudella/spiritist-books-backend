import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorElement = () => {
  const { t } = useTranslation('translation');
  const error = useRouteError();
  console.log(error);

  return <h4>{t('Ocorreu um erro...')}</h4>;
};
export default ErrorElement;
