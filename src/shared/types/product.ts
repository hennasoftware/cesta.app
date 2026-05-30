export type ProductCategory =
  | 'cafe'
  | 'romanticas'
  | 'personalizados'
  | 'corporativos'
  | 'datas-especiais';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: ProductCategory;
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
