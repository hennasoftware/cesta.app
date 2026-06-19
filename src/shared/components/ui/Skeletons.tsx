function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-coffee/8 dark:bg-white/10 ${className}`} />;
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-coffee/8 bg-white p-2 dark:border-white/14 dark:bg-[#24150f]">
      <SkeletonBlock className="aspect-[4/3] w-full sm:h-60 sm:aspect-auto" />
      <div className="space-y-4 p-3 sm:p-4">
        <SkeletonBlock className="h-6 w-4/5" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <div className="flex gap-2 py-2">
          <SkeletonBlock className="h-7 w-24 rounded-full" />
          <SkeletonBlock className="h-7 w-28 rounded-full" />
        </div>
        <SkeletonBlock className="h-8 w-32" />
        <SkeletonBlock className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

export function RouteSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Carregando página">
      <SkeletonBlock className="h-7 w-48" />
      <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => <ProductCardSkeleton key={index} />)}
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="mt-3 grid items-stretch gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3" role="status" aria-label="Carregando catálogo">
      {Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3" role="status" aria-label="Carregando produtos em destaque">
      {Array.from({ length: 3 }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}

export function AdminProductListSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-label="Carregando produtos">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="grid gap-4 rounded-[2rem] border border-coffee/8 bg-white p-4 dark:border-white/14 dark:bg-[#24150f] sm:grid-cols-[9rem_1fr]">
          <SkeletonBlock className="h-36 w-full sm:h-32" />
          <div className="space-y-3">
            <SkeletonBlock className="h-6 w-2/3" />
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-9 w-24 rounded-full" />
              <SkeletonBlock className="h-9 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-10 lg:px-8 lg:py-10" role="status" aria-label="Carregando produto">
      <div>
        <SkeletonBlock className="aspect-[4/3] w-full sm:aspect-[6/5]" />
        <div className="mt-3 flex gap-3">
          {Array.from({ length: 4 }, (_, index) => <SkeletonBlock key={index} className="h-20 w-20" />)}
        </div>
      </div>
      <div className="space-y-5 py-2">
        <SkeletonBlock className="h-10 w-4/5" />
        <SkeletonBlock className="h-12 w-44" />
        <SkeletonBlock className="h-5 w-36" />
        {Array.from({ length: 5 }, (_, index) => <SkeletonBlock key={index} className="h-10 w-full" />)}
        <SkeletonBlock className="h-14 w-full rounded-full" />
      </div>
    </div>
  );
}

export function AuthSkeleton() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-4 py-8" role="status" aria-label="Verificando acesso">
      <div className="w-full max-w-md space-y-4 rounded-[2rem] border border-coffee/8 bg-white p-6 dark:border-white/14 dark:bg-[#24150f]">
        <SkeletonBlock className="mx-auto h-20 w-24" />
        <SkeletonBlock className="mx-auto h-8 w-52" />
        <SkeletonBlock className="h-12 w-full rounded-full" />
        <SkeletonBlock className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
