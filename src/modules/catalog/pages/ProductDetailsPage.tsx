import { motion } from 'framer-motion';
import { ArrowLeft, CalendarHeart, Check, Gift, MessageSquareText, Sparkles, Star, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ProductCard } from '../../../shared/components/cards/ProductCard';
import { Seo } from '../../../shared/components/Seo';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { Badge } from '../../../shared/components/ui/Badge';
import { ButtonLink } from '../../../shared/components/ui/Button';
import { Loading } from '../../../shared/components/ui/Loading';
import { SectionTitle } from '../../../shared/components/ui/SectionTitle';
import { useProducts } from '../../../shared/hooks/useProducts';
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
  const { products, loading } = useProducts({ fallbackToMocks: false });
  const product = products.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  }, [product]);

  if (loading) {
    return <Loading label="Carregando produto..." variant="product" />;
  }

  if (!product) {
    return <Navigate to="/catalogo" replace />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo title={`${product.name} | Cesta.com`} description={product.longDescription || product.description} />
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm font-bold text-coffee/70 transition hover:text-caramel dark:text-cream/70">
        <ArrowLeft size={17} /> Voltar ao catálogo
      </Link>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white p-3 shadow-premium dark:border-white/14 dark:bg-[#24150f]">
            <img src={product.images[activeImage]} alt={product.name} className="h-[360px] w-full rounded-[2rem] object-cover sm:h-[520px]" />
            <div className="absolute left-8 top-8 rounded-full border border-white/80 bg-white px-4 py-2 text-sm font-extrabold text-espresso shadow-[0_12px_34px_rgba(36,21,15,0.32)]">
              Montagem artesanal
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                className={`h-28 overflow-hidden rounded-3xl border-2 transition ${
                  activeImage === index ? 'border-gold shadow-glow' : 'border-white/70 opacity-72 hover:opacity-100 dark:border-white/10'
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`Ver imagem ${index + 1}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/70 bg-white p-6 shadow-premium backdrop-blur dark:border-white/14 dark:bg-[#24150f] md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="rose">{product.tag}</Badge>
            <Badge tone="sage">Entrega local</Badge>
            <span className="flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-sm font-bold text-coffee dark:text-gold">
              <Star size={14} fill="currentColor" /> {product.rating.toFixed(1)}
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-coffee dark:text-cream md:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-coffee/74 dark:text-cream/80">{product.longDescription}</p>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4 rounded-[2rem] bg-cream p-5 dark:bg-[#1b100c]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">A partir de</p>
              <p className="mt-1 text-4xl font-extrabold text-coffee dark:text-cream">{formatCurrency(product.price)}</p>
            </div>
            <p className="max-w-52 text-sm font-semibold leading-6 text-coffee/72 dark:text-cream/76">Pedido final confirmado pelo atendimento conforme personalização.</p>
          </div>

          <div className="mt-8 rounded-[2rem] border border-coffee/8 bg-cream/80 p-5 dark:border-white/14 dark:bg-[#1f130e]">
            <p className="font-bold text-coffee dark:text-cream">Itens inclusos</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.includedItems.map((item) => (
                <p key={item} className="flex items-center gap-2 text-sm font-semibold text-coffee/74 dark:text-cream/80">
                  <Check size={17} className="text-sage" /> {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-[#25d366]/25 bg-[#25d366]/10 p-3 shadow-sm">
            <WhatsAppButton
              message={productOrderMessage(product.name)}
              size="lg"
              className="min-h-14 w-full bg-[#1f8f4d] text-base font-extrabold text-white shadow-[0_16px_36px_rgba(31,143,77,0.28)] hover:bg-[#187a40] dark:bg-[#25d366] dark:text-espresso dark:hover:bg-[#31df73]"
            >
              Pedir agora no WhatsApp
            </WhatsAppButton>
            <p className="mt-3 text-center text-xs font-bold text-coffee/70 dark:text-cream/75">
              Atendimento humano para confirmar disponibilidade, personalização e entrega.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="Experiência" title="Mais do que uma cesta, um gesto completo" />
        <div className="grid gap-5 md:grid-cols-4">
          {experienceBlocks.map((block) => (
            <div key={block.title} className="rounded-[2rem] border border-coffee/8 bg-white p-6 shadow-sm dark:border-white/14 dark:bg-[#24150f]">
              <block.icon className="text-sage" size={26} />
              <h3 className="mt-5 text-lg font-extrabold text-coffee dark:text-cream">{block.title}</h3>
              <p className="mt-3 text-sm leading-6 text-coffee/72 dark:text-cream/78">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2.5rem] bg-espresso p-6 text-cream shadow-premium md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-espresso shadow-sm ring-1 ring-white/20">
              Personalização
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold text-white md:text-4xl">Crie uma versão com a sua intenção.</h2>
            <p className="mt-4 leading-8 text-cream/80">
              O atendimento pode adaptar itens, mensagem, cores, flores e acabamento para combinar com a pessoa presenteada.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Cartão afetivo', 'Flores e laços', 'Itens gourmet'].map((item) => (
              <div key={item} className="rounded-3xl border border-white/14 bg-[#352117] p-5 text-center">
                <Gift className="mx-auto text-gold" size={24} />
                <p className="mt-3 text-sm font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="Avaliações" title="Detalhes percebidos por quem presenteia" />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-[2rem] border border-coffee/8 bg-white p-6 shadow-sm dark:border-white/14 dark:bg-[#24150f]">
              <p className="text-xl text-gold">{'★'.repeat(testimonial.rating)}</p>
              <p className="mt-4 text-sm leading-7 text-coffee/74 dark:text-cream/80">"{testimonial.text}"</p>
              <p className="mt-4 font-bold text-coffee dark:text-cream">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
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
          {(relatedProducts.length ? relatedProducts : products.filter((item) => item.id !== product.id).slice(0, 3)).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
