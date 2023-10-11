import React from 'react';
import { MdQueryStats, MdAdminPanelSettings } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [
  {
    text: 'adicionar livro',
    path: 'add-book',
    icon: <FaWpforms />,
  },
  {
    text: 'todos os livros',
    path: '.',
    icon: <MdQueryStats />,
  },
  {
    text: 'perfil',
    path: 'profile',
    icon: <ImProfile />,
  },
  {
    text: 'admin',
    path: 'admin',
    icon: <MdAdminPanelSettings />,
  },
];

export default links;
