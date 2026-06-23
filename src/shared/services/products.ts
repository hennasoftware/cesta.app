import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizeProductClassification } from '../config/categories';
import type { Product, ProductCategory, ProductSubcategory } from '../types/product';

export type CatalogSort = 'featured' | 'price-asc' | 'price-desc' | 'name';

export type CatalogFilters = {
  category: ProductCategory | 'todos';
  subcategory: ProductSubcategory | 'todas';
  sort: CatalogSort;
  pageSize: number;
};

export type CatalogPageResult = {
  products: Product[];
  lastDocument: QueryDocumentSnapshot<DocumentData> | null;
};

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  subcategory: ProductSubcategory | null;
  photo: string;
  images: string[];
  includedItems: string[];
  available: boolean;
  featured: boolean;
  featuredOrder: number;
  tag: string;
};

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function toDate(value: unknown) {
  if (value && typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate();
  }
  return undefined;
}

function mapProduct(snapshot: QueryDocumentSnapshot<DocumentData>): Product {
  const data = snapshot.data();
  const photo = data.photo || data.images?.[0] || '';
  const classification = normalizeProductClassification(data.category, data.subcategory);

  return {
    id: snapshot.id,
    slug: data.slug || slugify(data.name || snapshot.id),
    name: data.name || '',
    description: data.description || '',
    longDescription: data.longDescription || data.description || '',
    price: Number(data.price || 0),
    category: classification.category,
    subcategory: classification.subcategory,
    tag: data.tag || '',
    featured: Boolean(data.featured),
    featuredOrder: Number(data.featuredOrder || 999),
    photo,
    available: data.available !== false,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    images: data.images?.length ? data.images : [photo],
    includedItems: Array.isArray(data.includedItems) ? data.includedItems : [],
  };
}

function requireDb() {
  if (!db) throw new Error('Firebase nao configurado.');
  return db;
}

export function subscribeProducts(onChange: (products: Product[]) => void, onError: (error: Error) => void) {
  const database = requireDb();

  return onSnapshot(
    collection(database, 'products'),
    (snapshot) => {
      const products = snapshot.docs
        .map(mapProduct)
        .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      onChange(products);
    },
    (error) => onError(error),
  );
}

function publicFilterConstraints(filters: Pick<CatalogFilters, 'category' | 'subcategory'>): QueryConstraint[] {
  const constraints: QueryConstraint[] = [where('available', '==', true)];

  if (filters.category !== 'todos') {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.category === 'presentes' && filters.subcategory !== 'todas') {
    constraints.push(where('subcategory', '==', filters.subcategory));
  }

  return constraints;
}

function catalogOrderConstraint(sort: CatalogSort) {
  if (sort === 'price-asc') return orderBy('price', 'asc');
  if (sort === 'price-desc') return orderBy('price', 'desc');
  if (sort === 'featured') return orderBy('featured', 'desc');
  return orderBy('name', 'asc');
}

export async function getFeaturedProducts(maxProducts = 3) {
  const database = requireDb();
  try {
    const featuredSnapshot = await getDocs(
      query(
        collection(database, 'products'),
        where('available', '==', true),
        where('featured', '==', true),
        orderBy('featuredOrder', 'asc'),
        limit(maxProducts),
      ),
    );
    return featuredSnapshot.docs.map(mapProduct);
  } catch (error) {
    if (!isMissingIndexError(error)) throw error;
    const featuredSnapshot = await getDocs(
      query(collection(database, 'products'), where('featured', '==', true)),
    );
    return featuredSnapshot.docs
      .map(mapProduct)
      .filter((product) => product.available !== false)
      .sort(compareFeaturedProducts)
      .slice(0, maxProducts);
  }
}

export async function getProductBySlug(slug: string) {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, 'products'), where('slug', '==', slug), limit(1)));
  const product = snapshot.docs[0] ? mapProduct(snapshot.docs[0]) : null;
  return product?.available === false ? null : product;
}

export async function getRelatedProducts(product: Product, maxProducts = 3) {
  const database = requireDb();
  const snapshot = await getDocs(
    query(collection(database, 'products'), where('category', '==', product.category), limit(maxProducts + 2)),
  );

  return snapshot.docs
    .map(mapProduct)
    .filter((item) => item.id !== product.id && item.available !== false)
    .sort((a, b) => Number(b.subcategory === product.subcategory) - Number(a.subcategory === product.subcategory))
    .slice(0, maxProducts);
}

export async function getCatalogProductCount(filters: Pick<CatalogFilters, 'category' | 'subcategory'>) {
  const database = requireDb();
  const snapshot = await getCountFromServer(
    query(collection(database, 'products'), ...publicFilterConstraints(filters)),
  );
  return snapshot.data().count;
}

export async function getCatalogProductPage(
  filters: CatalogFilters,
  cursor?: QueryDocumentSnapshot<DocumentData> | null,
): Promise<CatalogPageResult> {
  const database = requireDb();
  const constraints: QueryConstraint[] = [
    ...publicFilterConstraints(filters),
    catalogOrderConstraint(filters.sort),
  ];
  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(filters.pageSize));

  const snapshot = await getDocs(query(collection(database, 'products'), ...constraints));
  return {
    products: snapshot.docs.map(mapProduct),
    lastDocument: snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1] : null,
  };
}

export async function searchCatalogProducts(filters: Pick<CatalogFilters, 'category' | 'subcategory'>) {
  const database = requireDb();
  const snapshot = await getDocs(
    query(collection(database, 'products'), ...publicFilterConstraints(filters)),
  );
  return snapshot.docs.map(mapProduct);
}

export async function getCatalogProductsWithoutCompositeIndex(filters: CatalogFilters) {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, 'products'));
  const products = snapshot.docs
    .map(mapProduct)
    .filter((product) => {
      const matchesAvailability = product.available !== false;
      const matchesCategory = filters.category === 'todos' || product.category === filters.category;
      const matchesSubcategory =
        filters.category !== 'presentes' ||
        filters.subcategory === 'todas' ||
        product.subcategory === filters.subcategory;
      return matchesAvailability && matchesCategory && matchesSubcategory;
    });

  return sortCatalogProducts(products, filters.sort);
}

function sortCatalogProducts(products: Product[], sort: CatalogSort) {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return compareFeaturedProducts(a, b);
  });
}

function compareFeaturedProducts(a: Product, b: Product) {
  const featuredDifference = Number(b.featured) - Number(a.featured);
  if (featuredDifference) return featuredDifference;
  const orderDifference = (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
  return orderDifference || a.name.localeCompare(b.name);
}

function isMissingIndexError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.message.includes('requires an index') || error.message.includes('create_composite');
}

export async function createProduct(values: ProductFormValues) {
  const database = requireDb();
  const slug = slugify(values.name);
  const images = normalizeImages(values);

  await addDoc(collection(database, 'products'), {
    ...values,
    subcategory: values.category === 'presentes' ? values.subcategory : null,
    photo: images[0],
    slug,
    longDescription: values.description,
    tag: values.tag.trim(),
    featured: values.featured,
    featuredOrder: values.featured ? Math.max(1, values.featuredOrder || 1) : 999,
    images,
    includedItems: values.includedItems.filter(Boolean),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(productId: string, values: ProductFormValues) {
  const database = requireDb();
  const slug = slugify(values.name);
  const images = normalizeImages(values);

  await updateDoc(doc(database, 'products', productId), {
    ...values,
    subcategory: values.category === 'presentes' ? values.subcategory : null,
    photo: images[0],
    slug,
    longDescription: values.description,
    tag: values.tag.trim(),
    featured: values.featured,
    featuredOrder: values.featured ? Math.max(1, values.featuredOrder || 1) : 999,
    images,
    includedItems: values.includedItems.filter(Boolean),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProductAvailability(productId: string, available: boolean) {
  const database = requireDb();
  await updateDoc(doc(database, 'products', productId), {
    available,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string) {
  const database = requireDb();
  await deleteDoc(doc(database, 'products', productId));
}

function normalizeImages(values: ProductFormValues) {
  const images = values.images.length ? values.images : values.photo ? [values.photo] : [];
  return images.filter(Boolean).slice(0, 4);
}

export async function imageFileToProductPhoto(file: File, maxDataUrlLength = 220_000) {
  const hasImageMime = file.type.startsWith('image/');
  const hasImageExtension = /\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name);

  if (!hasImageMime && !hasImageExtension) {
    throw new Error('Selecione um arquivo de imagem valido.');
  }

  const image = await loadImage(file);
  const dimensions = [900, 760, 640, 520, 420];
  const qualities = [0.78, 0.68, 0.58, 0.48, 0.38, 0.3];
  const outputTypes = getSupportedCanvasImageTypes();

  for (const maxSize of dimensions) {
    const { width, height } = fitSize(image.width, image.height, maxSize);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Nao foi possivel processar a imagem.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const outputType of outputTypes) {
      for (const quality of qualities) {
        const dataUrl = canvas.toDataURL(outputType, quality);
        if (dataUrl.length <= maxDataUrlLength) {
          return dataUrl;
        }
      }
    }
  }

  throw new Error('A imagem ficou grande demais para salvar no Firestore. Tente uma foto menor ou mais simples.');
}

function getSupportedCanvasImageTypes() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const types = ['image/webp', 'image/jpeg'];
  const supportedTypes = types.filter((type) => canvas.toDataURL(type, 0.8).startsWith(`data:${type}`));

  return supportedTypes.length ? supportedTypes : ['image/jpeg'];
}

function fitSize(width: number, height: number, maxSize: number) {
  if (width <= maxSize && height <= maxSize) return { width, height };

  const ratio = Math.min(maxSize / width, maxSize / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

async function loadImage(file: File) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Fallback below handles formats/browsers that createImageBitmap cannot decode.
    }
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Nao foi possivel ler a imagem selecionada.'));
    };

    image.src = url;
  });
}
