'use client';

import { useTranslations } from 'next-intl';

export function QuoteSection() {
  const t = useTranslations('pages.home.quote');

  return (
    <section className="py-16 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            {t('headline')}{" "}
            <span className="text-primary">{t('headlineHighlight')}</span>.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mt-6">
            {t('text')}
          </p>
        </div>
      </div>
    </section>
  );
}
