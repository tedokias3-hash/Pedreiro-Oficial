
import { Project, AdminCredentials, Category } from './types';

export const ADMIN_CREDENTIALS: AdminCredentials = {
  user: 'PO2026',
  pass: 'pedreirooficial'
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Reforma de Banheiro Luxo',
    category: 'Banheiros',
    beforeImage: 'https://picsum.photos/id/101/800/600',
    afterImage: 'https://picsum.photos/id/102/800/600',
    createdAt: Date.now() - 100000
  },
  {
    id: '2',
    title: 'Cozinha Americana Moderna',
    category: 'Cozinhas',
    beforeImage: 'https://picsum.photos/id/201/800/600',
    afterImage: 'https://picsum.photos/id/202/800/600',
    createdAt: Date.now() - 200000
  },
  {
    id: '3',
    title: 'Piso Laminado Sala Integrada',
    category: 'Pisos',
    beforeImage: 'https://picsum.photos/id/301/800/600',
    afterImage: 'https://picsum.photos/id/302/800/600',
    createdAt: Date.now() - 300000
  }
];

// Added Category to the imports above to fix the error on this line
export const CATEGORIES: Category[] = ['Todos', 'Banheiros', 'Cozinhas', 'Pisos', 'Pintura'];
