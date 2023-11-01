import { useEffect } from 'react';
import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import { useLoaderData, useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { StatItem } from '../components';
import { useTranslation } from 'react-i18next';

export const loader = async ({}) => {
  try {
    const response = await customFetch.get('/users/admin/app-stats');
    const data = response.data;
    return { result: 'success', data };
  } catch (error) {
    return { result: 'error' };
  }
};

const Admin = () => {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  useEffect(() => {
    if (loaderData.result === 'error') {
      toast.error(t('Você não está autorizado(a) a acessar esta página'));
      navigate('/dashboard');
    }
  }, [loaderData.result, t]);

  if (loaderData.data) {
    const { users, bookCount: books } = loaderData.data;

    return (
      <Wrapper>
        <StatItem
          title={t('usuários total')}
          count={users}
          color='#e9b949'
          bcg='#fcefc7'
          icon={<FaSuitcaseRolling />}
        />
        <StatItem
          title={t('total de livros')}
          count={books}
          color='#647acb'
          bcg='#e0e8f9'
          icon={<FaCalendarCheck />}
        />
      </Wrapper>
    );
  }
};

export default Admin;

const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
