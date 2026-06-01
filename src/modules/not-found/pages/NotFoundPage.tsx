import { ArrowLeft, Home, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '../../../shared/components/Seo';
import { ButtonLink } from '../../../shared/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <Seo title="Pagina nao encontrada | Cesta.com" description="A pagina solicitada nao foi encontrada." />
      <div className="grid w-full gap-8 overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-premium dark:border-white/14 dark:bg-[#24150f] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-espresso p-8 text-cream md:p-12">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold text-espresso">
            <SearchX size={30} />
          </div>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-gold">Pagina nao encontrada</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight text-white md:text-6xl">404</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-cream/78">
            O endereco acessado nao existe ou foi movido. Volte para uma area conhecida e continue navegando pelo catalogo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/" className="bg-white text-espresso hover:bg-cream">
              <Home size={18} /> Inicio
            </ButtonLink>
            <ButtonLink to="/catalogo" variant="secondary">
              Ver catalogo
            </ButtonLink>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          <span className="inline-flex w-fit rounded-full bg-gold/20 px-4 py-2 text-sm font-extrabold text-coffee dark:text-gold">
            Cesta.com
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-coffee dark:text-cream">A rota solicitada nao foi encontrada.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-coffee/72 dark:text-cream/78">
            Confira se o link foi digitado corretamente ou use os atalhos para retornar ao fluxo principal da loja.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-caramel transition hover:text-coffee dark:text-gold dark:hover:text-cream"
          >
            <ArrowLeft size={17} /> Voltar para a pagina anterior
          </button>
        </div>
      </div>
    </section>
  );
}
