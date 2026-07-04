import { ArrowRight } from 'lucide-react'

const templates = [
  { name: 'Elegant Wedding', category: 'Wedding', gradient: 'from-amber-400 to-amber-600', letter: 'E' },
  { name: 'Rose Garden', category: 'Wedding', gradient: 'from-rose-400 to-rose-600', letter: 'R' },
  { name: 'Royal Gold', category: 'Wedding', gradient: 'from-yellow-400 to-yellow-600', letter: 'R' },
  { name: 'Sweet Birthday', category: 'Birthday', gradient: 'from-purple-400 to-purple-600', letter: 'S' },
  { name: 'Baby Aqiqah', category: 'Aqiqah', gradient: 'from-emerald-400 to-emerald-600', letter: 'B' },
  { name: 'Corporate Event', category: 'Corporate', gradient: 'from-blue-400 to-blue-600', letter: 'C' },
]

export default function Templates() {
  return (
    <section id="templates" className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">
            Template
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cormorant)] font-bold text-stone-900 mb-4">
            Pilih Template Favorit Anda
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Koleksi template elegan untuk setiap momen spesial. Sesuaikan dengan gaya Anda sendiri.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.name}
              className="group rounded-2xl border border-stone-100 bg-white overflow-hidden shadow-sm transition hover:shadow-lg"
            >
              {/* Gradient preview */}
              <div className={`relative h-48 bg-gradient-to-br ${tpl.gradient} flex items-center justify-center`}>
                <span className="font-[family-name:var(--font-cormorant)] text-5xl font-bold text-white/30">
                  {tpl.letter}
                </span>
              </div>
              <div className="p-5">
                <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500 mb-2">
                  {tpl.category}
                </span>
                <h3 className="text-lg font-semibold text-stone-900 mb-3">
                  {tpl.name}
                </h3>
                <a
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Lihat
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-800 hover:shadow-lg"
          >
            Lihat Semua Template
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
