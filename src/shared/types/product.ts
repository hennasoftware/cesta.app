export type ProductCategory = 'cafe-da-manha' | 'vinho-e-frios' | 'presentes';

export type ProductSubcategory =
  | 'romanticas'
  | 'aniversarios'
  | 'maternidade'
  | 'promocao-graduacao'
  | 'tematicas';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: ProductCategory;
  subcategory?: ProductSubcategory | null;
  tag: string;
  featured?: boolean;
  rating: number;
  images: string[];
  photo?: string;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  includedItems: string[];
};

export type Category = {
  id: ProductCategory;
  name: string;
  description: string;
  image: string;
};
