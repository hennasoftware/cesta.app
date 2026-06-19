import { CheckCircle2, ImagePlus, PackagePlus, Save, Star, Trash2, X, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
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
  onDirtyChange: (dirty: boolean) => void;
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
  featured: false,
  featuredOrder: 1,
  tag: '',
};

const categoryOptions: Array<SelectOption<ProductCategory>> = productCategories.map((category) => ({
  value: category.id,
  label: category.name,
}));

const subcategoryOptions: Array<SelectOption<ProductSubcategory>> = giftSubcategories.map((subcategory) => ({
  value: subcategory.id,
  label: subcategory.name,
}));

const tagOptions: Array<SelectOption<string>> = [
  { value: '', label: 'Sem etiqueta' },
  { value: 'Mais Vendido', label: 'Mais Vendido' },
  { value: 'Novo', label: 'Novo' },
  { value: 'Promoção', label: 'Promoção' },
  { value: 'Edição Limitada', label: 'Edição Limitada' },
];

type FormSnapshot = {
  values: ProductFormValues;
  includedItemsText: string;
};

type FieldName = 'name' | 'description' | 'price' | 'category' | 'subcategory' | 'images';
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldOrder: FieldName[] = ['name', 'description', 'price', 'category', 'subcategory', 'images'];
const invalidFieldClass = 'border-red-400 ring-2 ring-red-200 dark:border-red-400 dark:ring-red-500/25';

function cloneValues(values: ProductFormValues): ProductFormValues {
  return {
    ...values,
    images: [...values.images],
    includedItems: [...values.includedItems],
  };
}

function snapshotsMatch(current: FormSnapshot, baseline: FormSnapshot) {
  return (
    current.values.name === baseline.values.name &&
    current.values.description === baseline.values.description &&
    current.values.price === baseline.values.price &&
    current.values.category === baseline.values.category &&
    current.values.subcategory === baseline.values.subcategory &&
    current.values.photo === baseline.values.photo &&
    current.values.available === baseline.values.available &&
    current.values.featured === baseline.values.featured &&
    current.values.featuredOrder === baseline.values.featuredOrder &&
    current.values.tag === baseline.values.tag &&
    current.includedItemsText === baseline.includedItemsText &&
    current.values.images.length === baseline.values.images.length &&
    current.values.images.every((image, index) => image === baseline.values.images[index])
  );
}

export function ProductForm({ product, onCancelEdit, onSaved, onDirtyChange }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [includedItemsText, setIncludedItemsText] = useState('');
  const [baseline, setBaseline] = useState<FormSnapshot>({
    values: cloneValues(initialValues),
    includedItemsText: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [processingImages, setProcessingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLDivElement | null>>>({});

  useEffect(() => {
    if (!product) {
      const nextValues = cloneValues(initialValues);
      setValues(nextValues);
      setIncludedItemsText('');
      setBaseline({ values: cloneValues(nextValues), includedItemsText: '' });
      setFieldErrors({});
      setError('');
      setProcessingImages(false);
      return;
    }

    const images = product.images?.length ? product.images : product.photo ? [product.photo] : [];

    const nextValues: ProductFormValues = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory ?? null,
      photo: images[0] || '',
      images,
      includedItems: product.includedItems,
      available: product.available !== false,
      featured: Boolean(product.featured),
      featuredOrder: product.featuredOrder ?? 1,
      tag: product.tag || '',
    };
    const nextItemsText = product.includedItems.join('\n');
    setValues(nextValues);
    setIncludedItemsText(nextItemsText);
    setBaseline({ values: cloneValues(nextValues), includedItemsText: nextItemsText });
    setFieldErrors({});
    setError('');
    setProcessingImages(false);
  }, [product]);

  const isDirty = useMemo(
    () => !snapshotsMatch({ values, includedItemsText }, baseline),
    [baseline, includedItemsText, values],
  );
  const availableTagOptions = useMemo(
    () =>
      values.tag && !tagOptions.some((option) => option.value === values.tag)
        ? [...tagOptions, { value: values.tag, label: values.tag }]
        : tagOptions,
    [values.tag],
  );

  useEffect(() => {
    onDirtyChange(isDirty);
    return () => onDirtyChange(false);
  }, [isDirty, onDirtyChange]);

  function updateField<Key extends keyof ProductFormValues>(key: Key, value: ProductFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function updateCategory(category: ProductCategory) {
    setValues((current) => ({
      ...current,
      category,
      subcategory: category === 'presentes' ? current.subcategory : null,
    }));
    setFieldErrors((current) => ({ ...current, category: undefined, subcategory: undefined }));
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
      setFieldErrors((current) => ({ ...current, images: undefined }));
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
    const errors: FieldErrors = {};
    if (!values.name.trim()) errors.name = 'Nome da cesta é obrigatório.';
    if (!values.description.trim()) errors.description = 'Descrição é obrigatória.';
    if (!values.price || values.price <= 0) errors.price = 'Informe um preço válido maior que zero.';
    if (!values.category) errors.category = 'Categoria é obrigatória.';
    if (values.category === 'presentes' && !values.subcategory) errors.subcategory = 'Subcategoria é obrigatória para cestas de presentes.';
    if (!values.images.length) errors.images = 'Adicione pelo menos uma imagem principal.';
    return errors;
  }

  function focusFirstInvalidField(errors: FieldErrors) {
    const firstField = fieldOrder.find((field) => errors[field]);
    if (!firstField) return;

    window.requestAnimationFrame(() => {
      const container = fieldRefs.current[firstField];
      if (!container) return;
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const control = container.querySelector<HTMLElement>(
        'input:not([type="file"]), textarea, [role="combobox"], button, [tabindex]',
      );
      (control ?? container).focus({ preventScroll: true });
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setError('');
      focusFirstInvalidField(validationErrors);
      return;
    }

    setSaving(true);
    setFieldErrors({});
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
      setBaseline({ values: cloneValues(initialValues), includedItemsText: '' });
      setFieldErrors({});
      setProcessingImages(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nao foi possivel salvar o produto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-premium dark:border-white/14 dark:bg-[#24150f] md:p-6">
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
        <div ref={(element) => { fieldRefs.current.name = element; }} tabIndex={-1}>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Nome <span className="text-red-600" aria-hidden="true">*</span></span>
          <Input
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Cesta cafe da manha"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'product-name-error' : undefined}
            containerClassName={fieldErrors.name ? invalidFieldClass : ''}
          />
          {fieldErrors.name && <p id="product-name-error" className="mt-2 text-sm font-bold text-red-700" role="alert">{fieldErrors.name}</p>}
        </div>

        <div ref={(element) => { fieldRefs.current.description = element; }} tabIndex={-1}>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Descrição <span className="text-red-600" aria-hidden="true">*</span></span>
          <Textarea
            value={values.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Descreva a experiência do presente"
            required
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? 'product-description-error' : undefined}
            containerClassName={fieldErrors.description ? invalidFieldClass : ''}
          />
          {fieldErrors.description && <p id="product-description-error" className="mt-2 text-sm font-bold text-red-700" role="alert">{fieldErrors.description}</p>}
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
          <div ref={(element) => { fieldRefs.current.price = element; }} tabIndex={-1}>
            <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Preço <span className="text-red-600" aria-hidden="true">*</span></span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.price || ''}
              onChange={(event) => updateField('price', Number(event.target.value))}
              placeholder="189.90"
              required
              aria-invalid={Boolean(fieldErrors.price)}
              aria-describedby={fieldErrors.price ? 'product-price-error' : undefined}
              containerClassName={fieldErrors.price ? invalidFieldClass : ''}
            />
            {fieldErrors.price && <p id="product-price-error" className="mt-2 text-sm font-bold text-red-700" role="alert">{fieldErrors.price}</p>}
          </div>
          <div ref={(element) => { fieldRefs.current.category = element; }} tabIndex={-1}>
            <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Categoria <span className="text-red-600" aria-hidden="true">*</span></span>
            <Select
              value={values.category}
              options={categoryOptions}
              onChange={updateCategory}
              ariaLabel="Categoria do produto"
              preserveOrder
              required
              invalid={Boolean(fieldErrors.category)}
              ariaDescribedBy={fieldErrors.category ? 'product-category-error' : undefined}
            />
            {fieldErrors.category && <p id="product-category-error" className="mt-2 text-sm font-bold text-red-700" role="alert">{fieldErrors.category}</p>}
          </div>
          {values.category === 'presentes' && (
            <div ref={(element) => { fieldRefs.current.subcategory = element; }} tabIndex={-1} className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Subcategoria <span className="text-red-600" aria-hidden="true">*</span></span>
              <Select
                value={values.subcategory}
                options={subcategoryOptions}
                onChange={(value) => updateField('subcategory', value)}
                ariaLabel="Subcategoria do produto"
                placeholder="Selecione"
                preserveOrder
                required
                invalid={Boolean(fieldErrors.subcategory)}
                ariaDescribedBy={fieldErrors.subcategory ? 'product-subcategory-error' : undefined}
              />
              {fieldErrors.subcategory && <p id="product-subcategory-error" className="mt-2 text-sm font-bold text-red-700" role="alert">{fieldErrors.subcategory}</p>}
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

        <div className="rounded-[1.5rem] border border-coffee/8 bg-cream/55 p-4 dark:border-white/12 dark:bg-[#1f130e]">
          <p className="text-sm font-extrabold text-coffee dark:text-cream">Destaque e promoção</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-coffee/60 dark:text-cream/60">
            Controle quais cestas aparecem na seção de destaques e qual etiqueta será exibida ao cliente.
          </p>

          <button
            type="button"
            role="switch"
            aria-checked={values.featured}
            onClick={() => updateField('featured', !values.featured)}
            className={`mt-4 flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-extrabold transition ${
              values.featured
                ? 'border-gold bg-gold/20 text-coffee dark:text-cream'
                : 'border-coffee/10 bg-white text-coffee/65 dark:border-white/14 dark:bg-[#24150f] dark:text-cream/70'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star size={18} fill={values.featured ? 'currentColor' : 'none'} />
              Produto em destaque
            </span>
            <span className={`relative h-6 w-11 rounded-full transition ${values.featured ? 'bg-caramel' : 'bg-coffee/20 dark:bg-white/20'}`} aria-hidden="true">
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${values.featured ? 'left-6' : 'left-1'}`} />
            </span>
          </button>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Etiqueta</span>
              <Select
                value={values.tag}
                options={availableTagOptions}
                onChange={(value) => updateField('tag', value)}
                ariaLabel="Etiqueta promocional do produto"
                preserveOrder
              />
            </div>
            <div>
              <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Ordem nos destaques</span>
              <Input
                type="number"
                min="1"
                step="1"
                value={values.featuredOrder || 1}
                onChange={(event) => updateField('featuredOrder', Math.max(1, Number(event.target.value) || 1))}
                disabled={!values.featured}
                placeholder="1"
              />
              <p className="mt-2 text-xs font-semibold text-coffee/55 dark:text-cream/55">
                Números menores aparecem primeiro.
              </p>
            </div>
          </div>
        </div>

        <div ref={(element) => { fieldRefs.current.images = element; }} tabIndex={-1}>
          <span className="mb-2 block text-sm font-bold text-coffee dark:text-cream">Fotos do produto <span className="text-red-600" aria-hidden="true">*</span></span>
          <label className={`flex min-h-28 cursor-pointer items-center justify-center rounded-[1.5rem] border border-dashed border-caramel/60 bg-cream/70 p-4 text-coffee transition hover:bg-gold/15 dark:border-gold/40 dark:bg-[#1f130e] dark:text-cream ${fieldErrors.images ? invalidFieldClass : ''}`}>
            <span className="flex items-center gap-2 text-sm font-bold">
              <ImagePlus size={18} /> Selecionar ate 4 fotos
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              aria-invalid={Boolean(fieldErrors.images)}
              aria-describedby={fieldErrors.images ? 'product-images-error' : undefined}
              onChange={(event) => {
                void addImages(event.target.files);
                event.target.value = '';
              }}
            />
          </label>
          {fieldErrors.images && <p id="product-images-error" className="mt-2 text-sm font-bold text-red-700" role="alert">{fieldErrors.images}</p>}
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

      {Object.keys(fieldErrors).length > 0 && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-800" role="alert" aria-live="assertive">
          <p className="text-sm font-extrabold">Revise os campos obrigatórios antes de salvar:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold">
            {fieldOrder.filter((field) => fieldErrors[field]).map((field) => (
              <li key={field}>{fieldErrors[field]}</li>
            ))}
          </ul>
        </div>
      )}

      <Button type="submit" className="mt-6 w-full" disabled={saving || processingImages}>
        {saving ? <Save className="animate-pulse" size={18} /> : <PackagePlus size={18} />}
        {processingImages ? 'Otimizando fotos...' : saving ? 'Salvando...' : product ? 'Salvar alteracoes' : 'Cadastrar produto'}
      </Button>
    </form>
  );
}
