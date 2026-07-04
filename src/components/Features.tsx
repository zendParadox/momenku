import {
  Palette,
  Sparkles,
  MessageCircle,
  QrCode,
  BarChart3,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Visual Editor",
    description:
      "Canva-like drag-drop editor. Langsung lihat preview di mobile frame.",
  },
  {
    icon: Sparkles,
    title: "AI Copywriting",
    description:
      "Masukkan data acara, AI tulis undangan yang touching dan personal.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Broadcast",
    description:
      "Kirim undangan ke semua tamu sekaligus dalam satu klik.",
  },
  {
    icon: QrCode,
    title: "QR Check-In",
    description:
      "Sistem check-in otomatis dengan QR code untuk setiap tamu.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Siapa buka, kapan, dari mana, berapa lama — semua terlihat.",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description:
      "Gunakan domain sendiri untuk undangan yang lebih eksklusif.",
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-stone-900">
            Semua yang Kamu Butuhkan
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            Fitur lengkap untuk membuat, mengirim, dan melacak undangan digital
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <feature.icon className="mb-4 h-8 w-8 text-amber-500" />
              <h3 className="mb-2 text-lg font-semibold text-stone-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
