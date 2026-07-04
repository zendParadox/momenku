import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Gratis',
    price: 'Rp0',
    period: '',
    description: 'Coba-coba, tanpa commit',
    features: [
      'Masa aktif 7 hari',
      '5 tema dasar',
      'Maks 50 tamu',
      '100MB storage',
      'Watermark',
      'RSVP basic',
    ],
    cta: 'Mulai Gratis',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: 'Rp49.000',
    period: '/undangan',
    description: 'Personal, cukup untuk wedding',
    features: [
      'Masa aktif 30 hari',
      'Semua tema premium',
      'Maks 200 tamu',
      '1GB storage',
      'Tanpa watermark',
      'WhatsApp broadcast',
      'QR Code check-in',
      'Export PDF & video',
    ],
    cta: 'Pilih Basic',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'Rp149.000',
    period: '/undangan',
    description: 'Full fitur, analytics lengkap',
    features: [
      'Masa aktif 90 hari',
      'Semua tema premium',
      'Unlimited tamu',
      '5GB storage',
      'Tanpa watermark',
      'AI copywriting unlimited',
      'Real-time analytics',
      'Custom domain',
      '2 collaborator',
      'Priority support',
    ],
    cta: 'Pilih Premium',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Rp499.000',
    period: '/undangan',
    description: 'Untuk wedding organizer & brand',
    features: [
      'Masa aktif 1 tahun',
      'Semua tema + custom',
      'Unlimited tamu',
      '20GB storage',
      'White-label branding',
      'AI unlimited + API access',
      'Advanced analytics + export',
      'Custom domain gratis',
      'Unlimited collaborator',
      'Dedicated support',
      'Custom template request',
    ],
    cta: 'Hubungi Kami',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">
            Harga
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cormorant)] font-bold text-stone-900 mb-4">
            Pilih Paket yang Pas
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Mulai gratis, upgrade saat butuh. Semua paket termasuk fitur inti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border transition-shadow hover:shadow-lg ${
                plan.highlighted
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                  : 'border-stone-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Paling Populer
                </span>
              )}

              <h3 className="text-lg font-semibold text-stone-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-stone-500 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-stone-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-stone-400">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-stone-600"
                  >
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
