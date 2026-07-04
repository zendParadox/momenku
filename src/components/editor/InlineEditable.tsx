'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Pencil } from 'lucide-react'

export interface InlineEditableProps {
  value: string
  onChange: (value: string) => void
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  placeholder?: string
  multiline?: boolean
}

function sanitizeHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

export default function InlineEditable({
  value,
  onChange,
  tag: Tag = 'span',
  className = '',
  placeholder = 'Klik untuk edit...',
  multiline = false,
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLElement>(null) as React.RefObject<any>
  const originalValueRef = useRef(value)

  useEffect(() => {
    if (!isEditing) {
      originalValueRef.current = value
      setDraft(value)
    }
  }, [value, isEditing])

  const handleDoubleClick = useCallback(() => {
    originalValueRef.current = value
    setDraft(value)
    setIsEditing(true)
    // Auto-focus after render
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.focus()
        // Select all text
        const selection = window.getSelection()
        if (selection && ref.current) {
          const range = document.createRange()
          range.selectNodeContents(ref.current)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    })
  }, [value])

  const handleBlur = useCallback(() => {
    if (!isEditing) return
    const sanitized = sanitizeHtml(draft)
    if (sanitized !== originalValueRef.current) {
      onChange(sanitized)
    }
    setIsEditing(false)
  }, [isEditing, draft, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!isEditing) return

      if (e.key === 'Escape') {
        e.preventDefault()
        setDraft(originalValueRef.current)
        setIsEditing(false)
        return
      }

      if (e.key === 'Enter' && !multiline) {
        e.preventDefault()
        const sanitized = sanitizeHtml(draft)
        if (sanitized !== originalValueRef.current) {
          onChange(sanitized)
        }
        setIsEditing(false)
        return
      }

      // For multiline, Shift+Enter allows newlines, plain Enter saves
      if (e.key === 'Enter' && multiline && !e.shiftKey) {
        e.preventDefault()
        const sanitized = sanitizeHtml(draft)
        if (sanitized !== originalValueRef.current) {
          onChange(sanitized)
        }
        setIsEditing(false)
      }
    },
    [isEditing, draft, multiline, onChange]
  )

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      if (ref.current) {
        setDraft(ref.current.innerText || '')
      }
    },
    []
  )

  const isEmpty = !value && !isEditing
  const displayText = isEmpty ? placeholder : value

  return (
    <span
      className={`relative group inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tag
        ref={ref}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        data-placeholder={placeholder}
        className={`${className} ${
          isEditing
            ? 'outline-none ring-2 ring-emerald-300 rounded px-1 -mx-1 transition-all duration-200'
            : isHovered
            ? 'border-b border-dashed border-stone-300 cursor-text transition-all duration-200'
            : ''
        } ${isEmpty && !isEditing ? 'text-stone-400 italic' : ''}`}
        style={{
          cursor: isEditing ? 'text' : isHovered ? 'text' : undefined,
        }}
        role={isEditing ? 'textbox' : undefined}
        aria-label={isEditing ? 'Edit text' : undefined}
      >
        {displayText}
      </Tag>

      {/* Edit icon on hover */}
      {isHovered && !isEditing && (
        <span className="absolute -right-5 top-1/2 -translate-y-1/2 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Pencil className="w-3 h-3" />
        </span>
      )}
    </span>
  )
}
