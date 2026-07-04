'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stats = [
  { label: 'Tema', value: '500+' },
  { label: 'Pengguna', value: '10rb+' },
  { label: 'Rating', value: '4.9★' },
];

export default function Hero() {
  return (
    <section
      className={cn(
        'relative flex min-h-screen items-center justify-center overflow-hidden',
        'bg-stone-50'
      )}
    >
      {/* Decorative emerald gradient circles */}
      <div
        className={cn(
          'pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full',
          'bg-gradient-to-br from-emerald-200/60 to-emerald-400/20 blur-3xl'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -bottom-32 -right-32 h-[440px] w-[440px] rounded-full',
          'bg-gradient-to-tl from-emerald-300/40 to-emerald-100/10 blur-3xl'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full',
          'bg-gradient-to-b from-emerald-100/50 to-transparent blur-3xl'
        )}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn(
          'relative z-10 mx-auto max-w-3xl px-6 text-center'
        )}
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className={cn(
            'font-[family-name:var(--font-cormorant)]',
            'text-5xl font-bold leading-tight tracking-tight text-stone-900',
            'sm:text-6xl lg:text-7xl'
          )}
        >
          Undangan Digital yang Bikin
          <br />
          Tamu Terpesona
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className={cn(
            'font-[family-name:var(--font-jakarta)]',
            'mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600',
            'sm:text-xl'
          )}
        >
          Buat undangan website custom dalam 10 menit.
          <br className="hidden sm:block" />
          {' '}AI-powered, 500+ tema, real-time analytics.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/register"
            className={cn(
              'inline-flex items-center justify-center rounded-xl px-8 py-3.5',
              'bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25',
              'transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2'
            )}
          >
            Coba Gratis
          </a>

          <a
            href="#templates"
            className={cn(
              'inline-flex items-center justify-center rounded-xl border border-stone-300 px-8 py-3.5',
              'bg-transparent text-sm font-semibold text-stone-700',
              'transition-all duration-200 hover:border-stone-400 hover:bg-stone-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2'
            )}
          >
            Lihat Contoh
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          className={cn(
            'mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-12'
          )}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span
                className={cn(
                  'font-[family-name:var(--font-cormorant)]',
                  'block text-3xl font-bold text-stone-900 sm:text-4xl'
                )}
              >
                {stat.value}
              </span>
              <span className="mt-1 block text-sm font-medium text-stone-500">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
