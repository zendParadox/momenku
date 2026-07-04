const links = {
  Product: ['Fitur', 'Template', 'Harga', 'Blog', 'Changelog'],
  Company: ['Tentang', 'Karir', 'Kontak', 'Press Kit'],
  Resources: ['Dokumentasi', 'Tutorial', 'API', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-[family-name:var(--font-cormorant)] font-bold text-white mb-3">
              MomenKu
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Undangan digital yang bikin tamu terpesona.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-stone-200 mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-stone-500 hover:text-stone-200 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-600">
            © 2026 MomenKu. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-stone-500 hover:text-stone-200 transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-stone-500 hover:text-stone-200 transition-colors">
              Instagram
            </a>
            <a href="#" className="text-sm text-stone-500 hover:text-stone-200 transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
