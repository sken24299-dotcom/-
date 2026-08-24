export type Project = {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  category: string;
  description: string;
  descriptionEn?: string;
  coverImage: string;
  images?: string[];
  tags: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published?: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  number?: string;
  year?: string;
  services?: string[];
  value?: string;
  overview?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  principles?: string[];
  imageBase?: string;
};

export type ProjectRow = {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  category: string;
  description: string;
  description_en: string | null;
  cover_image: string;
  images: string[] | null;
  tags: string[] | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  published?: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
