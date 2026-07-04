'use client'

import type { CustomData } from '@/types/editor'

export default function CustomSection({ data }: { data: CustomData }) {
  return (
    <div className="w-full bg-white">
      {data.css && <style>{data.css}</style>}
      <div dangerouslySetInnerHTML={{ __html: data.html }} />
    </div>
  )
}
