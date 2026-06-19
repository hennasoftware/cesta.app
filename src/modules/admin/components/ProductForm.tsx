import { CheckCircle2, ImagePlus, PackagePlus, Save, Star, Trash2, X, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { giftSubcategories, productCategories } from '../../../shared/config/categories';
import { createProduct, imageFileToProductPhoto, updateProduct, type ProductFormValues } from '../../../shared/services/products';
import type { Product, ProductCategory, ProductSubcategory } from '../../../shared/types/product';

type ProductFormProps = {
  product?: Product | null;
  onCancelEdit: () => void;
  onSaved: (message: string) => void;
};

const initialValues: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  category: 'cafe-da-manha',
  subcategory: null,
  photo: '',
  images: [],
  includedItems: [],
  available: true,
};

const categoryOptions: Array<SelectOption<ProductCategory>> = productCategories.map((category) => ({
  value: category.id,
  label: category.name,
}));

const subcategoryOptions: Array<SelectOption<ProductSubcategory>> = giftSubcategories.map((subcategory) => ({
  value: subcategory.id,
  label: subcategory.name,
}));

export function ProductForm({ product, onCancelEdit, onSaved }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [includedItemsText, setIncludedItemsText] = useState('');
  const [error, setError] = useState('');
  const [processingImages, setProcessingImages] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) {
      setValues(initialValues);
      setIncludedItemsText('');
      setProcessingImages(false);
      return;
    }

    const images = product.images?.length ? product.images : product.photo ? [product.photo] : [];

    setValues({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory ?? null,
      photo: images[0] || '',
      images,
      includedItems: product.includedItems,
      available: product.available !== false,
    });
    setIncludedItemsText(product.includedItems.join('\n'));
    setProcessingImages(false);
  }, [product]);

  function updateField<Key extends keyof ProductFormValues>(key: Key, value: ProductFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateCategory(category: ProductCategory) {
    setValues((current) => ({
      ...current,
      category,
      subcategory: category === 'presentes' ? current.subcategory : null,
    }));
  }

  function updateImages(images: string[]) {
    const normalizedImages = images.slice(0, 4);
    setValues((current) => ({
      ...current,
      images: normalizedImages,
      photo: normalizedImages[0] || '',
    }));
  }

  async function addImages(files: FileList | null) {
    if (!files?.length) return;

    const remainingSlots = 4 - values.images.length;
    if (remainingSlots <= 0) {
      setError('Limite de 4 fotos por produto.');
      return;
    }

    setProcessingImages(true);
    setError('');

    try {
      const selectedFiles = Array.from(files).slice(0, remainingSlots);
      const optimizedImages = await Promise.all(selectedFiles.map((file) => imageFileToProductPhoto(file)));
      const nextImages = [...values.images, ...optimizedImages].slice(0, 4);
      const totalImageSize = nextImages.reduce((total, image) => total + image.length, 0);

      if (totalImageSize > 880_000) {
        throw new Error('As fotos ultrapassaram o limite seguro do Firestore. Remova uma foto ou use imagens mais simples.');
      }

      updateImages(nextImages);
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : 'Nao foi possivel processar as fotos.');
    } finally {
      setProcessingImages(false);
    }
  }

  function removeImage(index: number) {
    updateImages(values.images.filter((_, imageIndex) => imageIndex !== index));
  }

  function setMainImage(index: number) {
    if (index === 0) return;
    const images = [...values.images];
    const [selectedImage] = images.splice(index, 1);
    updateImages([selectedImage, ...images]);
  }

  function validate() {
    if (!values.name.trim()) return 'Informe o nome do produto.';
    if (!values.description.trim()) return 'Informe a descricao do produto.';
    if (!values.category) return 'Selecione uma categoria.';
    if (values.category === 'presentes' && !values.subcategory) return 'Selecione uma subcategoria.';
    if (!values.price || values.price <= 0) return 'Informe um preco valido.';
    if (!values.images.length) return 'Envie pelo menos uma foto do produto.';
    return '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const images = values.images.slice(0, 4);
      const totalImageSize = images.reduce((total, image) => total + image.length, 0);

      if (totalImageSize > 880_000) {
        throw new Error('As fotos ultrapassaram o limite seguro do Firestore. Remova uma foto ou use imagens mais simples.');
      }

      const includedItems = includedItemsText
        .split(/\r?\n/)
        .map((item) => item.replace(/^\s*(?:[-*•–—]|\d+[.)])\s*/, '').trim())
        .filter(Boolean);
      const payload = { ...values, images, photo: images[0], includedItems };

      if (product) {
        await updateProduct(product.id, payload);
        onSaved('Produto atualizado com sucesso.');
      } else {
        await createProduct(payload);
        onSaved('Produto cadastrado com sucesso.');
      }

      setValues(initialValues);
      setIncludedItemsText('');
      setProcessingImages(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel salvar o produto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-premium dark:border-white/14 dark:bg-[#24150f] md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-caramel">{product ? 'Editar produto' : 'Novo produto'}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-coffee dark:text-cream">{product ? product.name : 'Cadastrar cesta'}</h2>
        </div>
        {product && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit} aria-label="Cancelar edicao">
            <X size={17} /> Cancelar
          </Button>
        )}
      </div>

      <div className="mt-6 grid gap-4">
        <div>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Nome</span>
          <Input value={values.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Cesta cafe da manha" />
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Descricao</span>
          <Textarea value={values.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Descreva os itens e a experiencia do presente" />
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Itens da cesta</span>
          <Textarea
            value={includedItemsText}
            onChange={(event) => setIncludedItemsText(event.target.value)}
            placeholder={'Cole a lista inteira aqui, com um item por linha.\n\nEx:\n- Pão de queijo\n- Croissant\n- Cappuccino'}
            className="min-h-44"
          />
          <p className="mt-2 text-xs font-semibold leading-5 text-coffee/60 dark:text-cream/60">
            Use uma linha para cada item. Marcadores como hífen, bolinha ou numeração são removidos automaticamente ao salvar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Preco</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.price || ''}
              onChange={(event) => updateField('price', Number(event.target.value))}
              placeholder="189.90"
            />
          </div>
          <div>
            <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Categoria</span>
            <Select
              value={values.category}
              options={categoryOptions}
              onChange={updateCategory}
              ariaLabel="Categoria do produto"
              preserveOrder
            />
          </div>
          {values.category === 'presentes' && (
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Subcategoria</span>
              <Select
                value={values.subcategory}
                options={subcategoryOptions}
                onChange={(value) => updateField('subcategory', value)}
                ariaLabel="Subcategoria do produto"
                placeholder="Selecione"
                preserveOrder
              />
            </div>
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Disponibilidade</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => updateField('available', true)}
              className={`flex h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-extrabold transition ${
                values.available
                  ? 'border-pistachio bg-pistachio text-coffee shadow-sm'
                  : 'border-coffee/10 bg-white text-coffee/60 hover:bg-cream dark:border-white/14 dark:bg-[#1f130e] dark:text-cream/70'
              }`}
            >
              <CheckCircle2 size={17} /> Disponivel
            </button>
            <button
              type="button"
              onClick={() => updateField('available', false)}
              className={`flex h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-extrabold transition ${
                !values.available
                  ? 'border-red-200 bg-red-100 text-red-700 shadow-sm'
                  : 'border-coffee/10 bg-white text-coffee/60 hover:bg-cream dark:border-white/14 dark:bg-[#1f130e] dark:text-cream/70'
              }`}
            >
              <XCircle size={17} /> Indisponivel
            </button>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Fotos do produto</span>
          <label className="flex min-h-28 cursor-pointer items-center justify-center rounded-[1.5rem] border border-dashed border-caramel/60 bg-cream/70 p-4 text-coffee transition hover:bg-gold/15 dark:border-gold/40 dark:bg-[#1f130e] dark:text-cream">
            <span className="flex items-center gap-2 text-sm font-bold">
              <ImagePlus size={18} /> Selecionar ate 4 fotos
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => {
                void addImages(event.target.files);
                event.target.value = '';
              }}
            />
          </label>
          <p className="mt-2 text-xs font-semibold text-coffee/60 dark:text-cream/60">
            A primeira foto sera usada como imagem principal no catalogo. {values.images.length}/4 fotos adicionadas.
          </p>

          {processingImages && (
            <p className="mt-3 rounded-2xl bg-gold/20 px-4 py-3 text-sm font-bold text-coffee">
              Otimizando fotos selecionadas...
            </p>
          )}

          {values.images.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {values.images.map((image, index) => (
                <div key={image} className="relative overflow-hidden rounded-[1.25rem] border border-coffee/10 bg-white dark:border-white/14 dark:bg-[#1f130e]">
                  <img src={image} alt={`Foto ${index + 1} do produto`} className="h-36 w-full object-cover" />
                  <div className="absolute left-2 top-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className={`grid h-8 w-8 place-items-center rounded-full shadow-sm ${
                        index === 0 ? 'bg-gold text-espresso' : 'bg-white/90 text-coffee hover:bg-gold'
                      }`}
                      aria-label="Definir como foto principal"
                    >
                      <Star size={15} fill={index === 0 ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-700 shadow-sm hover:bg-red-50"
                    aria-label="Remover foto"
                  >
                    <Trash2 size={15} />
                  </button>
                  {index === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-espresso">Principal</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

      <Button type="submit" className="mt-6 w-full" disabled={saving || processingImages}>
        {saving ? <Save className="animate-pulse" size={18} /> : <PackagePlus size={18} />}
        {processingImages ? 'Otimizando fotos...' : saving ? 'Salvando...' : product ? 'Salvar alteracoes' : 'Cadastrar produto'}
      </Button>
    </form>
  );
}
