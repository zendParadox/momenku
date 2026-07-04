export default function CTA() {
  return (
    <section className="py-24 px-6 bg-emerald-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cormorant)] font-bold text-white mb-4">
          Wujudkan Undangan Impianmu
        </h2>
        <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
          Mulai gratis, tanpa kartu kredit. Bikin undangan digital yang bikin
          semua tamu terpesona.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
            Daftar Gratis Sekarang
          </button>
          <button className="px-8 py-3.5 border border-emerald-400 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            Lihat Demo Live
          </button>
        </div>
        <p className="text-emerald-200 text-sm mt-6">
          Tanpa kartu kredit · Setup 10 menit · Cancel kapan saja
        </p>
      </div>
    </section>
  )
}
