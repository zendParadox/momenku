'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { Search, Crown, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  category: string
  is_premium: boolean
  thumbnail_url: string | null
}

const categories = ['All', 'Wedding', 'Birthday', 'Aqiqah', 'Engagement', 'Corporate'] as const
type Category = (typeof categories)[number]

const hardcodedTemplates: Template[] = [
  { id: 'tpl-1', name: 'Elegant Wedding', category: 'wedding', is_premium: false, thumbnail_url: null },
  { id: 'tpl-2', name: 'Modern Minimal', category: 'wedding', is_premium: false, thumbnail_url: null },
  { id: 'tpl-3', name: 'Rose Garden', category: 'wedding', is_premium: false, thumbnail_url: null },
  { id: 'tpl-4', name: 'Royal Gold', category: 'wedding', is_premium: true, thumbnail_url: null },
  { id: 'tpl-5', name: 'Sakura Blossom', category: 'wedding', is_premium: true, thumbnail_url: null },
  { id: 'tpl-6', name: 'Sweet Birthday', category: 'birthday', is_premium: false, thumbnail_url: null },
  { id: 'tpl-7', name: 'Party Celebration', category: 'birthday', is_premium: false, thumbnail_url: null },
  { id: 'tpl-8', name: 'Baby Aqiqah', category: 'aqiqah', is_premium: false, thumbnail_url: null },
  { id: 'tpl-9', name: 'Engagement Bliss', category: 'engagement', is_premium: true, thumbnail_url: null },
  { id: 'tpl-10', name: 'Corporate Event', category: 'corporate', is_premium: false, thumbnail_url: null },
]

const categoryGradients: Record<string, string> = {
  wedding: 'from-amber-400 to-amber-600',
  birthday: 'from-purple-400 to-purple-600',
  aqiqah: 'from-emerald-400 to-emerald-600',
  engagement: 'from-rose-400 to-rose-600',
  corporate: 'from-blue-400 to-blue-600',
}

const categoryBadgeColors: Record<string, string> = {
  wedding: 'bg-amber-50 text-amber-700',
  birthday: 'bg-purple-50 text-purple-700',
  aqiqah: 'bg-emerald-50 text-emerald-700',
  engagement: 'bg-rose-50 text-rose-700',
  corporate: 'bg-blue-50 text-blue-700',
}

export default function TemplatesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabase
        .from('templates')
        .select('id, name, category, is_premium, thumbnail_url')
        .order('name')

      if (error || !data || data.length === 0) {
        setTemplates(hardcodedTemplates)
      } else {
        setTemplates(data)
      }
      setLoading(false)
    }

    fetchTemplates()
  }, [supabase])

  const filtered = templates.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-stone-900">
            Pilih Template
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Temukan template yang sempurna untuk undangan Anda
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20">
          <Search className="h-10 w-10 text-stone-300" />
          <h3 className="mt-4 text-lg font-semibold text-stone-900">
            Template tidak ditemukan
          </h3>
          <p className="mt-1 max-w-sm text-center text-sm text-stone-500">
            Coba kata kunci lain atau ubah filter kategori
          </p>
        </div>
      ) : (
        /* Template grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => {
            const gradient = categoryGradients[template.category] || categoryGradients.wedding
            const badgeColor = categoryBadgeColors[template.category] || categoryBadgeColors.wedding
            return (
              <div
                key={template.id}
                className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:border-emerald-200 hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className={`relative h-48 bg-gradient-to-br ${gradient}`}>
                  {template.thumbnail_url ? (
                    <img
                      src={template.thumbnail_url}
                      alt={template.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/60">
                      <span className="font-[family-name:var(--font-cormorant)] text-3xl font-bold">
                        {template.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {template.is_premium && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-sm">
                      <Crown className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-stone-900 group-hover:text-emerald-700">
                      {template.name}
                    </h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badgeColor}`}>
                      {template.category}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard/editor/new?template=${template.id}`)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Gunakan Template
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
