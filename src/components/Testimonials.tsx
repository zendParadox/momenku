const testimonials = [
  {
    name: 'Fitri & Andi',
    role: 'Pernikahan, Januari 2026',
    text: 'Tamunya pada terpesona! Banyak yang bilang ini undangan paling keren yang pernah mereka terima. Proses bikinnya juga gampang banget.',
    rating: 5,
  },
  {
    name: 'Rina Susanti',
    role: 'Wedding Organizer',
    text: 'Sejak pakai MomenKu, klien saya naik 40%. Fitur custom domain dan analytics-nya juara. Worth every penny.',
    rating: 5,
  },
  {
    name: 'Budi & Maya',
    role: 'Pernikahan, Desember 2025',
    text: 'AI copywriting-nya nolong banget. Gue gak jago nulis, tapi undangan jadinya touching banget. Mantap!',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">
            Testimoni
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cormorant)] font-bold text-stone-900 mb-4">
            Dipercaya Pasangan Indonesia
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Lebih dari 10.000 pasangan sudah mempercayakan momen spesial mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                <p className="text-xs text-stone-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
