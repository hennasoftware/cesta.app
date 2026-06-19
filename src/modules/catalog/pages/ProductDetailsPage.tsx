import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarHeart,
  Check,
  ChevronLeft,
  ChevronRight,
  Gift,
  Maximize2,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ProductCard } from '../../../shared/components/cards/ProductCard';
import { Seo } from '../../../shared/components/Seo';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { Badge } from '../../../shared/components/ui/Badge';
import { ButtonLink } from '../../../shared/components/ui/Button';
import { ProductDetailsSkeleton } from '../../../shared/components/ui/Skeletons';
import { SectionTitle } from '../../../shared/components/ui/SectionTitle';
import { getCategoryName, getSubcategoryName } from '../../../shared/config/categories';
import { useProductDetails } from '../../../shared/hooks/useProducts';
import { testimonials } from '../../../shared/mocks/products';
import { formatCurrency, productOrderMessage } from '../../../shared/services/whatsapp';

const experienceBlocks = [
  {
    icon: CalendarHeart,
    title: 'Ideal para',
    text: 'Aniversários, boas-vindas, agradecimentos e manhãs que merecem um gesto especial.',
  },
  {
    icon: MessageSquareText,
    title: 'Mensagem que acompanha',
    text: 'Inclua um cartão afetivo com texto personalizado para tornar a entrega mais íntima.',
  },
  {
    icon: Truck,
    title: 'Experiência de entrega',
    text: 'Embalagem elegante, cuidado no transporte e apresentação pensada para surpreender.',
  },
  {
    icon: Sparkles,
    title: 'Personalize este presente',
    text: 'Adicione flores, chocolates, bebida especial ou detalhes alinhados à ocasião.',
  },
];

export function ProductDetailsPage() {
  const { slug } = useParams();
  const { product, relatedProducts, loading } = useProductDetails(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const images = product?.images?.length ? product.images : product?.photo ? [product.photo] : [];

  useEffect(() => {
    setActiveImage(0);
    setIsImageViewerOpen(false);
  }, [product?.id]);

  useEffect(() => {
    if (!isImageViewerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsImageViewerOpen(false);
        return;
      }

      if (images.length < 2) return;
      if (event.key === 'ArrowLeft') {
        setActiveImage((current) => (current - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setActiveImage((current) => (current + 1) % images.length);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, isImageViewerOpen]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <Navigate to="/catalogo" replace />;
  }

  const categoryName = getCategoryName(product.category, true);
  const subcategoryName = getSubcategoryName(product.subcategory);
  const categoryUrl = `/catalogo?categoria=${product.category}${
    product.subcategory ? `&subcategoria=${product.subcategory}` : ''
  }`;

  function showPreviousImage() {
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  }

  function showNextImage() {
    setActiveImage((current) => (current + 1) % images.length);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Seo title={`${product.name} | Cesta.com`} description={product.longDescription || product.description} />

      {isImageViewerOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#080403]/95 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${product.name}`}
          onClick={() => setIsImageViewerOpen(false)}
        >
          <div className="relative flex h-full w-full max-w-7xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img
              src={images[activeImage]}
              alt={`${product.name} - imagem ${activeImage + 1}`}
              className="max-h-full max-w-full object-contain"
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3">
              <span className="rounded-full bg-black/55 px-3 py-2 text-xs font-extrabold text-white backdrop-blur">
                {activeImage + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setIsImageViewerOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-white hover:text-espresso"
                aria-label="Fechar imagem ampliada"
              >
                <X size={21} />
              </button>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-0 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-white hover:text-espresso sm:left-3 sm:h-12 sm:w-12"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={23} />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-0 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-white hover:text-espresso sm:right-3 sm:h-12 sm:w-12"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight size={23} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="border-b border-coffee/8 bg-white/45 dark:border-[#f26922]/20 dark:bg-[#140b08]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 text-xs font-bold text-coffee/60 sm:px-6 lg:px-8 dark:text-cream/60">
          <Link to="/catalogo" className="inline-flex shrink-0 items-center gap-1.5 transition hover:text-caramel">
            <ArrowLeft size={14} /> Catálogo
          </Link>
          <ChevronRight size={13} className="shrink-0 opacity-40" />
          <Link to={categoryUrl} className="shrink-0 transition hover:text-caramel">
            {subcategoryName ?? categoryName}
          </Link>
          <ChevronRight size={13} className="shrink-0 opacity-40" />
          <span className="truncate text-coffee dark:text-white">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-10 lg:px-8 lg:py-10">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-lg border border-coffee/8 bg-white p-2 shadow-[0_18px_50px_rgba(74,33,23,0.10)] dark:border-[#f26922]/20 dark:bg-[#21120d] dark:shadow-[0_18px_50px_rgba(0,0,0,0.34)]">
            <button
              type="button"
              onClick={() => setIsImageViewerOpen(true)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-cream text-left sm:aspect-[6/5]"
              aria-label={`Ampliar imagem de ${product.name}`}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                decoding="async"
                {...{ fetchpriority: 'high' }}
              />
              {product.tag && (
                <div className="absolute inset-x-0 top-0 flex items-start p-3 sm:p-4">
                  <span className="rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-espresso shadow-sm backdrop-blur">
                    {product.tag}
                  </span>
                </div>
              )}
              <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-black/45 text-white shadow-sm backdrop-blur transition group-hover:bg-white group-hover:text-espresso sm:bottom-4 sm:right-4">
                <Maximize2 size={18} />
              </span>
            </button>
          </div>

          {images.length > 1 && (
            <div className="premium-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-3">
              {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`aspect-square w-20 shrink-0 overflow-hidden rounded-md border-2 bg-white p-1 transition sm:w-auto ${
                  activeImage === index
                    ? 'border-caramel shadow-[0_8px_20px_rgba(242,105,34,0.18)]'
                    : 'border-transparent opacity-65 hover:opacity-100 dark:bg-[#21120d]'
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`Ver imagem ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                <img src={image} alt="" className="h-full w-full rounded-[3px] object-cover" loading="lazy" decoding="async" />
              </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-y border-coffee/10 py-5 dark:border-[#f26922]/20 sm:py-6 lg:border lg:bg-white lg:p-7 lg:shadow-[0_18px_50px_rgba(74,33,23,0.09)] lg:dark:bg-[#21120d] lg:dark:shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-coffee dark:text-white sm:text-4xl lg:text-[2.65rem]">
              {product.name}
            </h1>

            <div className="mt-5 border-y border-coffee/8 py-5 dark:border-[#f26922]/18">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-caramel dark:text-[#ff9b4a]">A partir de</p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-3xl font-extrabold leading-none text-coffee dark:text-white sm:text-4xl">
                  {formatCurrency(product.price)}
                </p>
                <span className="text-right text-xs font-semibold leading-5 text-coffee/55 dark:text-[#d9b8a7]">
                  Consultar
                  <br />
                  valor do frete
                </span>
              </div>
            </div>

            {product.includedItems.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-caramel dark:text-[#ff9b4a]">Itens inclusos</p>
                <div className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {product.includedItems.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex min-h-11 items-center gap-3 border-b border-coffee/8 py-2 text-sm font-bold text-coffee/76 dark:border-[#f26922]/14 dark:text-[#f4d8c8]"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pistachio text-sage dark:bg-[#123b39] dark:text-[#64e3dd]">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.longDescription && (
              <div className="mt-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-caramel dark:text-[#ff9b4a]">Descrição e observações</p>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-coffee/72 dark:text-[#f4d8c8]">{product.longDescription}</p>
              </div>
            )}

            <WhatsAppButton
              message={productOrderMessage(product.name)}
              size="lg"
              className="mt-6 min-h-14 w-full bg-[#1f8f4d] text-base font-extrabold text-white shadow-[0_14px_30px_rgba(31,143,77,0.24)] hover:bg-[#187a40] dark:bg-[#25d366] dark:text-espresso dark:hover:bg-[#31df73]"
            >
              Pedir esta cesta
            </WhatsAppButton>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone="coffee">{categoryName}</Badge>
              {subcategoryName && <Badge tone="rose">{subcategoryName}</Badge>}
              <Badge tone="sage">Disponível</Badge>
            </div>

            <div className="mt-5 grid grid-cols-3 divide-x divide-coffee/8 border-t border-coffee/8 pt-5 dark:divide-[#f26922]/16 dark:border-[#f26922]/16">
              {[
                { icon: Truck, label: 'Entrega local' },
                { icon: Sparkles, label: 'Personalizável' },
                { icon: ShieldCheck, label: 'Atendimento humano' },
              ].map((item) => (
                <div key={item.label} className="px-2 text-center first:pl-0 last:pr-0">
                  <item.icon className="mx-auto text-sage dark:text-[#46d8d2]" size={18} />
                  <p className="mt-2 text-[11px] font-extrabold leading-4 text-coffee/68 dark:text-[#f2d4c4]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <SectionTitle eyebrow="Experiência" title="Tudo pensado para uma entrega marcante" />
        <div className="grid border-y border-coffee/10 dark:border-[#f26922]/18 sm:grid-cols-2 lg:grid-cols-4">
          {experienceBlocks.map((block, index) => (
            <div
              key={block.title}
              className={`px-4 py-6 sm:px-6 ${
                index > 0 ? 'border-t border-coffee/10 dark:border-[#f26922]/18 sm:border-t-0 sm:border-l' : ''
              } ${index === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-md bg-pistachio text-sage dark:bg-[#123b39] dark:text-[#64e3dd]">
                <block.icon size={20} />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-coffee dark:text-white">{block.title}</h3>
              <p className="mt-2 text-sm leading-6 text-coffee/66 dark:text-[#d9b8a7]">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-espresso py-14 text-cream dark:border-y dark:border-[#f26922]/18 dark:bg-[#100806] sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
          <div>
            <span className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-espresso shadow-sm ring-1 ring-white/20">
              Personalização
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">Crie uma versão com a sua intenção.</h2>
            <p className="mt-4 max-w-xl leading-8 text-cream/78">
              O atendimento pode adaptar itens, mensagem, cores, flores e acabamento para combinar com a pessoa presenteada.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Cartão afetivo', 'Flores e laços', 'Itens gourmet'].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-white/14 py-4 dark:border-[#f26922]/22 sm:block sm:border-b-0 sm:border-l sm:px-5 sm:py-3 sm:first:border-l-0">
                <Gift className="shrink-0 text-gold" size={22} />
                <p className="text-sm font-bold sm:mt-3">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <SectionTitle eyebrow="Avaliações" title="Detalhes percebidos por quem presenteia" />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="border-l-2 border-gold bg-white/55 px-5 py-4 dark:border-[#ff9b4a] dark:bg-[#21120d]">
              <div className="flex items-center gap-1 text-gold">
                <Star size={15} fill="currentColor" />
                <span className="text-sm font-extrabold">{testimonial.rating.toFixed(1)}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-coffee/74 dark:text-[#f4d8c8]">"{testimonial.text}"</p>
              <p className="mt-3 text-sm font-extrabold text-coffee dark:text-white">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-coffee/8 bg-white/45 py-14 dark:border-[#f26922]/16 dark:bg-[#170d0a] sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Relacionados"
          title="Outras formas de surpreender"
          action={
            <ButtonLink to="/catalogo" variant="secondary">
              Ver catálogo completo
            </ButtonLink>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        </div>
      </section>

      <div className="mx-auto hidden max-w-7xl grid-cols-3 gap-4 px-4 py-8 sm:px-6 lg:grid lg:px-8">
        {[
          { icon: PackageCheck, title: 'Montagem cuidadosa', text: 'Cada item é organizado para uma apresentação impecável.' },
          { icon: Truck, title: 'Entrega coordenada', text: 'Data e disponibilidade são confirmadas pelo atendimento.' },
          { icon: ShieldCheck, title: 'Compra assistida', text: 'Você fala com uma pessoa antes de finalizar o pedido.' },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-4">
            <item.icon className="shrink-0 text-sage dark:text-[#46d8d2]" size={23} />
            <div>
              <p className="text-sm font-extrabold text-coffee dark:text-white">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-coffee/60 dark:text-[#d9b8a7]">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
