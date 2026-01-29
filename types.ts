
export type Category = 'Todos' | 'Banheiros' | 'Cozinhas' | 'Pisos' | 'Pintura';

export interface Project {
  id: string;
  title: string;
  category: Category;
  beforeImage: string;
  afterImage: string;
  createdAt: number;
}

export interface AdminCredentials {
  user: string;
  pass: string;
}
