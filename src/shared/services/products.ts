import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, ProductCategory } from '../types/product';

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  photo: string;
  images: string[];
  includedItems: string[];
  available: boolean;
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

  return {
    id: snapshot.id,
    slug: data.slug || slugify(data.name || snapshot.id),
    name: data.name || '',
    description: data.description || '',
    longDescription: data.longDescription || data.description || '',
    price: Number(data.price || 0),
    category: data.category || 'personalizados',
    tag: data.tag || (data.available === false ? 'Indisponivel' : 'Disponivel'),
    featured: Boolean(data.featured),
    rating: Number(data.rating || 5),
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

export async function createProduct(values: ProductFormValues) {
  const database = requireDb();
  const slug = slugify(values.name);
  const images = normalizeImages(values);

  await addDoc(collection(database, 'products'), {
    ...values,
    photo: images[0],
    slug,
    longDescription: values.description,
    tag: values.available ? 'Disponivel' : 'Indisponivel',
    featured: false,
    rating: 5,
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
    photo: images[0],
    slug,
    longDescription: values.description,
    tag: values.available ? 'Disponivel' : 'Indisponivel',
    images,
    includedItems: values.includedItems.filter(Boolean),
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
