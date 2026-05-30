import { motion } from 'framer-motion';
import { ArrowRight, Gift, HeartHandshake, PackageCheck, ShieldCheck, Sparkles, Timer, Truck, Wand2 } from 'lucide-react';
import { ProductCard } from '../../../shared/components/cards/ProductCard';
import { Badge } from '../../../shared/components/ui/Badge';
import { ButtonLink } from '../../../shared/components/ui/Button';
import { SectionTitle } from '../../../shared/components/ui/SectionTitle';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { useProducts } from '../../../shared/hooks/useProducts';
import { testimonials } from '../../../shared/mocks/products';
import { customOrderMessage } from '../../../shared/services/whatsapp';

const heroImage = 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1800&q=90';

const steps = [
  { icon: Gift, title: 'Escolha sua cesta', text: 'Navegue por composições prontas para cada ocasião.' },
  { icon: Wand2, title: 'Personalize', text: 'Inclua mensagem, itens especiais e acabamento afetivo.' },
  { icon: HeartHandshake, title: 'Faça o pedido', text: 'Finalize pelo WhatsApp com atendimento humano.' },
  { icon: PackageCheck, title: 'Entrega especial', text: 'Receba uma experiência montada com cuidado artesanal.' },
];

const benefits = [
  { icon: Timer, title: 'Entrega rápida', text: 'Agilidade em Guaratinguetá - SP e região.' },
  { icon: Sparkles, title: 'Produtos selecionados', text: 'Curadoria gourmet, fresca e visualmente impecável.' },
  { icon: HeartHandshake, title: 'Atendimento personalizado', text: 'Cada pedido recebe orientação próxima e sensível.' },
  { icon: Gift, title: 'Montagem artesanal', text: 'Acabamento premium em cada laço, cartão e detalhe.' },
];

const trustItems = [
  { icon: Truck, label: 'Entrega em Guaratinguetá' },
  { icon: ShieldCheck, label: 'Pedido via WhatsApp' },
  { icon: Sparkles, label: 'Produtos selecionados' },
];

export function HomePage() {
  const { products } = useProducts({ fallbackToMocks: false });
  const featuredProducts = (products.some((product) => product.featured) ? products.filter((product) => product.featured) : products).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="relative overflow-hidden bg-espresso sm:min-h-[calc(100vh-5rem)]">
        <div className="relative mx-4 mt-5 overflow-hidden rounded-[2rem] border border-white/12 shadow-glow sm:hidden">
          <img className="aspect-[4/3] w-full object-cover object-center" src={heroImage} alt="Cesta premium Cesta.com" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
        </div>
        <img
          className="absolute inset-0 hidden h-full w-full object-cover object-center sm:block"
          src={heroImage}
          alt="Cesta premium Cesta.com"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-espresso/90 via-coffee/68 to-coffee/18 sm:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-36 bg-gradient-to-t from-cream to-transparent dark:from-espresso sm:block" />

        <div className="relative mx-auto flex max-w-7xl items-center px-4 py-10 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-14 lg:px-8">
          <motion.div
            className="max-w-3xl py-6 text-cream sm:py-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">Cesta.com</h1>
            <p className="mt-4 text-2xl font-bold text-gold">Conectando afetos</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/88">
              Cestas de café da manhã, presentes personalizados e kits afetivos com presença premium, montagem artesanal e entrega emocional.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                to="/catalogo"
                size="lg"
                className="border border-white bg-white text-espresso shadow-glow hover:bg-cream hover:text-espresso dark:border-white dark:bg-white dark:text-espresso dark:hover:bg-cream"
              >
                Ver Catálogo <ArrowRight size={18} />
              </ButtonLink>
              <WhatsAppButton message={customOrderMessage()} size="lg">
                Fazer Pedido
              </WhatsAppButton>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/22 bg-white/10 p-4 shadow-sm backdrop-blur sm:bg-black/18">
                  <item.icon size={19} className="text-gold" />
                  <p className="text-sm font-bold text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 right-4 hidden max-w-sm rounded-[2rem] border border-white/25 bg-espresso/48 p-5 text-cream shadow-glow backdrop-blur-xl lg:block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Experiência afetiva</p>
          <p className="mt-3 text-2xl font-extrabold text-white">Um presente que chega com intenção, beleza e cuidado.</p>
        </motion.div>
      </section>

      <section id="como-funciona" className="bg-white/55 py-16 dark:bg-[#1f130e]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Como funciona" title="Do carinho à entrega em poucos passos" />
          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="rounded-[2rem] border border-coffee/8 bg-cream/90 p-6 shadow-sm dark:border-white/14 dark:bg-[#2a1a13]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coffee text-cream dark:bg-gold dark:text-espresso">
                  <step.icon size={21} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-coffee dark:text-gold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-coffee/70 dark:text-linen/90">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Diferenciais"
          title="Uma experiência de presente premium"
          action={
            <ButtonLink to="/catalogo" variant="secondary">
              Explorar produtos
            </ButtonLink>
          }
        />
        <div className="grid gap-5 md:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-premium dark:border-white/14 dark:bg-[#24150f]">
              <benefit.icon className="text-sage dark:text-pistachio" size={28} />
              <h3 className="mt-5 text-lg font-extrabold text-coffee dark:text-gold">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-coffee/70 dark:text-linen/90">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Destaques" title="Cestas com alto apelo de presente" />
        <div className="grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-espresso py-16 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Depoimentos" title="Quem recebe sente o cuidado" inverted />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-glow">
                <p className="text-2xl text-gold">{'★'.repeat(testimonial.rating)}</p>
                <p className="mt-5 text-lg leading-8 text-cream/88">"{testimonial.text}"</p>
                <p className="mt-5 font-bold text-gold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
