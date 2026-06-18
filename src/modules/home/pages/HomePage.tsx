import { motion } from 'framer-motion';
import { ArrowRight, Gift, HeartHandshake, PackageCheck, ShieldCheck, Sparkles, Timer, Truck, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '../../../shared/components/cards/ProductCard';
import { Seo } from '../../../shared/components/Seo';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button, ButtonLink } from '../../../shared/components/ui/Button';
import { SectionTitle } from '../../../shared/components/ui/SectionTitle';
import { WhatsAppButton } from '../../../shared/components/WhatsAppButton';
import { useProducts } from '../../../shared/hooks/useProducts';
import { testimonials } from '../../../shared/mocks/products';
import { customOrderMessage } from '../../../shared/services/whatsapp';
import { brand } from '../../../shared/config/brand';
import { OrderGuideModal } from '../components/OrderGuideModal';
import heroImage from '../../../assets/hero.jpg';
import mobileHeroImage from '../../../assets/heroMobile.jpg';

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
  const [isOrderGuideOpen, setIsOrderGuideOpen] = useState(false);
  const { products } = useProducts({ fallbackToMocks: false });
  const featuredProducts = (products.some((product) => product.featured) ? products.filter((product) => product.featured) : products).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Seo title={`${brand.name} | ${brand.tagline}`} description="Cestas de cafe da manha, presentes personalizados e kits afetivos com entrega local e atendimento pelo WhatsApp." />
      <OrderGuideModal open={isOrderGuideOpen} onClose={() => setIsOrderGuideOpen(false)} />
      <section className="relative overflow-hidden bg-espresso sm:min-h-[calc(100vh-5rem)]">
        <div className="relative left-1/2 h-[calc(100svh-5rem)] min-h-[620px] w-screen -translate-x-1/2 overflow-hidden bg-espresso shadow-glow sm:hidden">
          <img className="h-full w-full object-cover object-center" src={mobileHeroImage} alt="Cesta.com, WhatsApp (12) 3126-3230 e Instagram @cesta.com_" />
        </div>
        <div className="absolute inset-0 hidden sm:block">
          <img
            className="h-full w-full object-cover object-center"
            src={heroImage}
            alt="Cesta premium Cesta.com"
          />
        </div>
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
              <Button type="button" size="lg" variant="secondary" onClick={() => setIsOrderGuideOpen(true)}>
                Pedido guiado
              </Button>
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
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex items-start gap-4 rounded-lg border border-coffee/8 bg-cream/90 p-4 shadow-sm dark:border-white/14 dark:bg-[#2a1a13] sm:block sm:p-6"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-coffee text-cream dark:bg-gold dark:text-espresso sm:h-12 sm:w-12">
                  <step.icon size={21} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-coffee dark:text-gold sm:mt-5 sm:text-lg">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-coffee/70 dark:text-linen/90 sm:mt-3">{step.text}</p>
                </div>
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
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4 rounded-lg border border-coffee/8 bg-white p-4 shadow-[0_10px_30px_rgba(74,33,23,0.07)] dark:border-white/14 dark:bg-[#24150f] sm:block sm:p-6 sm:shadow-premium">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-pistachio">
                <benefit.icon className="text-sage" size={23} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-coffee dark:text-gold sm:mt-5 sm:text-lg">{benefit.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-coffee/70 dark:text-linen/90 sm:mt-3">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Destaques" title="Cestas com alto apelo de presente" />
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
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
