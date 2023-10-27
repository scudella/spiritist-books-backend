import { useNavigation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SubmitBtn = ({ formBtn }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const { t } = useTranslation('translation');

  return (
    <button
      type='submit'
      className={`btn btn-block ${formBtn && 'form-btn'} `}
      disabled={isSubmitting}
    >
      {isSubmitting ? t('enviando...') : t('enviar')}
    </button>
  );
};
export default SubmitBtn;
