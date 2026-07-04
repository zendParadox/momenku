# 🎯 MomenKu — Digital Invitation SaaS
## Planning Document v1.0

**Analisis:** SatuMomen.com (Indonesia's leading digital invitation platform)
**Goal:** Build a superior alternative with better UX, performance, modern tech, and AI features

---

## 1. Analisis SatuMomen.com

### Yang Sudah Ada (Good)
- 500+ tema undangan untuk berbagai kategori acara
- WhatsApp broadcast untuk kirim undangan massal
- QR Code check-in system
- Custom domain
- Custom music latar
- Form RSVP yang bisa dikustom
- Export video & PDF
- Amplop digital & tanda kasih
- Google Maps integration
- Reseller & affiliate program

### Yang Bisa Di-upgrade (Opportunities)
| Area | SatuMomen | MomenKu (Target) |
|------|-----------|------------------|
| **Performance** | Server-rendered, slow load | Edge-first, <1s load |
| **Editor** | Basic drag-drop | Visual editor seperti Canva |
| **AI** | Tidak ada | AI copywriting, auto-layout |
| **Design System** | Mixed, tidak konsisten | Atomic design, fully themed |
| **Mobile** | Responsive tapi basic | Mobile-first, PWA, offline |
| **Analytics** | Basic RSVP | Real-time dashboard + heatmap |
| **Payment** | Midtrans | Midtrans + Stripe + QRIS |
| **Multi-language** | Indonesia only | ID, EN, AR, JA |
| **Collaboration** | Single user | Multi-editor (couple mode) |
| **Template Customization** | Terbatas | Full CSS control + sections |
| **Video 3D** | Basic | Three.js + Lottie animations |
| **Integrasi** | WhatsApp | WA, SMS, Email, Telegram, IG |
| **SEO** | Basic | Full SEO + social sharing |
| **Accessibility** | Minimal | WCAG 2.1 AA compliant |

---

## 2. Produk MomenKu

### 2.1 Tagline
> "Undangan Digital yang Bikin Tamu Terpesona"
> "Digital Invitations That Wow Your Guests"

### 2.2 Target Market
- **Primary:** Pasangan menikah (25-35 tahun, tech-savvy)
- **Secondary:** Event organizer, wedding organizer
- **Tertiary:** Ulang tahun, aqiqah, khitanan, corporate event

### 2.3 Unique Selling Points (USP)
1. **AI-Powered Copywriting** — Masukkan data acara, AI tulis undangan yang touching
2. **Canva-like Visual Editor** — Drag-drop, real-time preview, tanpa coding
3. **3D Immersive Experience** — WebGL/Three.js untuk undangan interaktif
4. **Real-time Analytics** — Siapa yang buka, kapan, dari mana, berapa lama
5. **Multi-channel Delivery** — WhatsApp, SMS, Email, Telegram, QR Code sekaligus
6. **Instant Load** — Edge-deployed, gambar otomatis compressed, offline-ready

---

## 3. Tech Stack

### 3.1 Frontend
| Tech | Alasan |
|------|--------|
| **Next.js 15** | App Router, RSC, streaming, edge runtime |
| **React 19** | Server Components, Actions, optimistic updates |
| **TypeScript 5** | Type safety, DX |
| **Tailwind CSS 4** | Utility-first, design tokens, dark mode |
| **Framer Motion** | Smooth animations, page transitions |
| **Three.js / React Three Fiber** | 3D invitation rendering |
| **Lexical / TipTap** | Rich text editor untuk custom content |
| **Zustand** | Lightweight state management |
| **React Hook Form + Zod** | Form validation |

### 3.2 Backend
| Tech | Alasan |
|------|--------|
| **Next.js API Routes** | Colocated API, edge runtime |
| **Hono** | Lightweight, edge-compatible API framework |
| **Prisma** | Type-safe ORM, migrations |
| **PostgreSQL (Neon)** | Serverless Postgres, branching |
| **Redis (Upstash)** | Rate limiting, caching, queues |
| **BullMQ** | Job queues (email, SMS, video render) |
| **Better Auth** | Modern auth (Google, GitHub, phone) |

### 3.3 Services
| Service | Purpose |
|---------|---------|
| **Cloudflare R2** | Image/video storage (S3-compatible, no egress fee) |
| **Cloudflare CDN** | Edge caching, DDoS protection |
| **Midtrans** | Payment (Indonesia) |
| **Stripe** | Payment (International) |
| **Resend** | Transactional email |
| **WhatsApp Business API** | WhatsApp broadcast |
| **Vercel** | Hosting, edge functions, analytics |
| **Upstash QStash** | Async job scheduling |
| **OpenAI / Claude** | AI copywriting, image generation |

### 3.4 DevOps
| Tool | Purpose |
|------|---------|
| **Vercel** | CI/CD, preview deploys |
| **GitHub Actions** | Tests, linting |
| **Playwright** | E2E testing |
| **Vitest** | Unit testing |
| **Sentry** | Error tracking |
| **PostHog** | Analytics, feature flags |
| **Turso** | SQLite edge database (backup) |

---

## 4. Database Schema (Core)

### 4.1 Users & Auth
```sql
users
  id            UUID PRIMARY KEY
  name          VARCHAR(255)
  email         VARCHAR(255) UNIQUE
  phone         VARCHAR(20)
  avatar_url    TEXT
  plan          ENUM('free','basic','premium','enterprise')
  credits       INT DEFAULT 5
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

accounts         -- OAuth providers
sessions         -- Active sessions
```

### 4.2 Invitations
```sql
invitations
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  slug          VARCHAR(100) UNIQUE  -- momenku.com/ahmad-fatih
  custom_domain VARCHAR(255) NULL
  title         VARCHAR(255)
  event_type    ENUM('wedding','birthday','aqiqah','corporate','other')
  event_date    TIMESTAMP
  event_location TEXT
  event_lat     DECIMAL
  event_lng     DECIMAL
  status        ENUM('draft','published','archived')
  settings      JSONB               -- theme, colors, fonts, etc.
  ai_copy       JSONB               -- AI-generated content cache
  analytics     JSONB               -- view counts, unique visitors
  expires_at    TIMESTAMP
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
```

### 4.3 Invitation Pages (Sections)
```sql
invitation_pages
  id            UUID PRIMARY KEY
  invitation_id UUID REFERENCES invitations
  slug          VARCHAR(100)        -- "mempelai", "galeri", "rsvp"
  title         VARCHAR(255)
  content       JSONB               -- Lexical/TipTap document format
  layout        VARCHAR(50)         -- "hero", "couple", "gallery", "rsvp", etc.
  sort_order    INT
  visible       BOOLEAN DEFAULT true
  created_at    TIMESTAMP
  updated_at    TIMESTAMP
```

### 4.4 Guests & RSVP
```sql
guests
  id            UUID PRIMARY KEY
  invitation_id UUID REFERENCES invitations
  name          VARCHAR(255)
  phone         VARCHAR(20)
  email         VARCHAR(255)
  group          VARCHAR(100)       -- "keluarga_mempelai", "teman_kantor", etc.
  qr_token      VARCHAR(255) UNIQUE
  status        ENUM('pending','sent','opened','attending','declined')
  plus_one      BOOLEAN DEFAULT false
  plus_one_name VARCHAR(255)
  checked_in    BOOLEAN DEFAULT false
  checked_in_at TIMESTAMP
  message       TEXT
  created_at    TIMESTAMP

rsvp_responses
  id            UUID PRIMARY KEY
  guest_id      UUID REFERENCES guests
  custom_fields JSONB               -- dynamic form fields
  responded_at  TIMESTAMP
```

### 4.5 Media
```sql
media
  id            UUID PRIMARY KEY
  invitation_id UUID REFERENCES invitations
  type          ENUM('image','video','audio','document')
  url           TEXT                -- R2 public URL
  thumb_url     TEXT                -- Optimized thumbnail
  blur_hash     VARCHAR(255)        -- LQIP placeholder
  width         INT
  height        INT
  duration      INT                 -- for audio/video (seconds)
  file_size     BIGINT
  sort_order    INT
  created_at    TIMESTAMP
```

### 4.6 Messages & Wishes
```sql
wishes
  id            UUID PRIMARY KEY
  invitation_id UUID REFERENCES invitations
  guest_name    VARCHAR(255)
  message       TEXT
  is_approved   BOOLEAN DEFAULT false
  created_at    TIMESTAMP

```

### 4.7 Digital Envelopes
```sql
envelopes
  id            UUID PRIMARY KEY
  invitation_id UUID REFERENCES invitations
  guest_id      UUID REFERENCES guests
  amount        DECIMAL(12,2)
  bank_name     VARCHAR(100)
  account_name  VARCHAR(255)
  message       TEXT
  status        ENUM('pending','paid','verified')
  payment_url   TEXT
  created_at    TIMESTAMP
  paid_at       TIMESTAMP
```

### 4.8 Payments
```sql
payments
  id            UUID PRIMARY KEY
  user_id       UUID REFERENCES users
  plan          ENUM('basic','premium','enterprise')
  amount        DECIMAL(12,2)
  currency      VARCHAR(3) DEFAULT 'IDR'
  method        VARCHAR(50)        -- 'midtrans','stripe','qris'
  status        ENUM('pending','paid','failed','refunded')
  external_id   VARCHAR(255)       -- Midtrans/Stripe transaction ID
  metadata      JSONB
  created_at    TIMESTAMP
  paid_at       TIMESTAMP
```

---

## 5. Halaman & Fitur

### 5.1 Public Pages
| Page | Deskripsi |
|------|-----------|
| `/` | Landing page — hero, features, pricing, testimonials |
| `/pricing` | Pricing table dengan calculator |
| `/templates` | Gallery tema (filter by category, color, style) |
| `/templates/[slug]` | Preview tema + live demo |
| `/blog` | SEO content, tips undangan digital |
| `/about` | Tentang MomenKu |
| `/login` | Auth (Google, email, phone) |
| `/register` | Signup |

### 5.2 Dashboard Pages (Authenticated)
| Page | Deskripsi |
|------|-----------|
| `/dashboard` | Overview — total undangan, views, RSVP |
| `/dashboard/invitations` | List semua undangan |
| `/dashboard/invitations/new` | Create new — pilih tema atau blank |
| `/dashboard/invitations/[id]` | Invitation overview |
| `/dashboard/invitations/[id]/editor` | **Visual Editor** (Canva-like) |
| `/dashboard/invitations/[id]/guests` | Guest management + import |
| `/dashboard/invitations/[id]/rsvp` | RSVP responses + analytics |
| `/dashboard/invitations/[id]/wishes` | Wishes management |
| `/dashboard/invitations/[id]/envelopes` | Digital envelope tracking |
| `/dashboard/invitations/[id]/analytics` | Real-time analytics dashboard |
| `/dashboard/invitations/[id]/share` | Multi-channel sharing tools |
| `/dashboard/settings` | Profile, billing, team |
| `/dashboard/billing` | Subscription + payment history |

### 5.3 Invitation Pages (Public, per invitation)
| Page | URL | Deskripsi |
|------|-----|-----------|
| Cover | `/[slug]` | Hero section with couple names, date, countdown |
| Mempelai | `/[slug]/mempelai` | Bride & groom profiles |
| Galeri | `/[slug]/galeri` | Photo/video gallery |
| Detail Acara | `/[slug]/acara` | Date, time, venue, maps |
| RSVP | `/[slug]/rsvp` | Response form |
| Ucapan | `/[slug]/ucapan` | Wishes wall |
| Amplop Digital | `/[slug]/amplop` | Digital envelope / gift |
| Livestream | `/[slug]/live` | YouTube/Vimeo embed |
| Tur | `/[slug]/tur` | Virtual tour (360° photo) |

### 5.4 Real-time Features
| Feature | Implementation |
|---------|----------------|
| **Live guest counter** | WebSocket — "XXX orang sudah hadir" |
| **Real-time wishes** | Server-Sent Events — wishes appear live |
| **Check-in scanner** | PWA camera + QR decode |
| **Notification** | Push notification when guest RSVPs |
| **View counter** | "XXX orang melihat undangan ini" |

---

## 6. Visual Editor (Core Feature)

### 6.1 Editor Sections
```
┌─────────────────────────────────────────────┐
│  SIDEBAR  │       CANVAS (Live Preview)      │
│           │                                    │
│ [Sections]│  ┌──────────────────────────────┐ │
│  + Cover  │  │                              │ │
│  + Mempelai│  │     Mobile Preview           │ │
│  + Galeri │  │     (375px frame)            │ │
│  + Acara  │  │                              │ │
│  + RSVP   │  │                              │ │
│  + Ucapan │  │                              │ │
│  + Amplop │  │                              │ │
│           │  └──────────────────────────────┘ │
│ [Theme]   │                                    │
│  Colors   │  ┌──────────────────────────────┐ │
│  Fonts    │  │  PROPERTIES PANEL             │ │
│  Layout   │  │  - Background image           │ │
│           │  │  - Text color                 │ │
│ [Media]   │  │  - Font size                  │ │
│  Photos   │  │  - Spacing                    │ │
│  Videos   │  │  - Animation                  │ │
│  Music    │  └──────────────────────────────┘ │
│           │                                    │
│ [AI]      │                                    │
│  Generate │                                    │
│  Copy     │                                    │
└─────────────────────────────────────────────┘
```

### 6.2 Editor Capabilities
1. **Section Management** — Add, remove, reorder, toggle visibility
2. **Inline Editing** — Click text langsung edit (contenteditable)
3. **Background Customization** — Image, gradient, video, color
4. **Typography Control** — Font family, size, weight, color, spacing
5. **Layout Options** — Full-width, contained, split, grid
6. **Animation Presets** — Fade-in, slide-up, parallax, typewriter
7. **Responsive Preview** — Toggle mobile/tablet/desktop
8. **Undo/Redo** — Full history stack
9. **Version History** — Save versions, restore previous
10. **Collaboration** — Real-time multi-cursor editing

### 6.3 AI Features
| Feature | Description |
|---------|-------------|
| **AI Copywriting** | Input data acara → AI generates touching invitation text |
| **AI Layout Suggestion** | Analyze content → suggest best section arrangement |
| **AI Color Palette** | Upload photo → extract harmonious color scheme |
| **AI Music Match** | Event type → suggest mood-appropriate background music |
| **AI Guest Message** | Auto-reply to guest wishes with personalized thank you |
| **Smart Crop** | AI crops images to best focal point for each section |

---

## 7. Performance Targets

| Metric | SatuMomen (est.) | MomenKu Target |
|--------|------------------|----------------|
| First Contentful Paint | ~3s | <0.8s |
| Largest Contentful Paint | ~5s | <1.5s |
| Time to Interactive | ~4s | <2s |
| Cumulative Layout Shift | ~0.15 | <0.05 |
| Total Blocking Time | ~800ms | <200ms |
| Lighthouse Score | ~60 | 95+ |
| TTI on 3G | ~8s | <4s |

### 7.1 Performance Strategies
1. **Edge Deployment** — All static assets served from edge (Cloudflare)
2. **Image Optimization** — Next/Image + R2 transforms (WebP, AVIF, blur-up)
3. **Font Subsetting** — Only load characters used (Indonesian + Latin)
4. **Code Splitting** — Per-route bundles, lazy load editor
5. **Streaming SSR** — Progressive rendering, Suspense boundaries
6. **Service Worker** — Offline support, background sync
7. **Prefetching** — Hover-prefetch next pages
8. **Bundle Analysis** — Automated size budgets in CI

---

## 8. Design System

### 8.1 Brand
| Element | Value |
|---------|-------|
| **Primary** | `#059669` (Emerald) — Trust, elegance |
| **Secondary** | `#F59E0B` (Amber) — Warmth, celebration |
| **Accent** | `#8B5CF6` (Violet) — Premium feel |
| **Background** | `#FAFAF9` (Stone warm) |
| **Text** | `#1C1917` (Stone 900) |
| **Dark Mode** | Full dark theme support |

### 8.2 Typography
| Use | Font |
|-----|------|
| **Headings** | Plus Jakarta Sans (Bold/SemiBold) |
| **Body** | Inter (Regular/Medium) |
| **Invitation Display** | Cormorant Garamond (Elegant) |
| **Invitation Script** | Great Vibes (Handwritten) |
| **Mono** | JetBrains Mono |

### 8.3 Component Library
- Built on **Radix UI** primitives
- Styled with **Tailwind CSS**
- **Framer Motion** animations
- Fully accessible (WCAG 2.1 AA)
- Dark mode variants
- Responsive (mobile-first)

---

## 9. Roadmap

### Phase 1: Foundation (Week 1-4)
- [ ] Project setup (Next.js 15, DB, Auth)
- [ ] Database schema + migrations
- [ ] Landing page
- [ ] Auth system (Google, Email)
- [ ] Dashboard layout
- [ ] Basic invitation CRUD

### Phase 2: Editor Core (Week 5-8)
- [ ] Visual editor framework
- [ ] Section system (Cover, Couple, Gallery, RSVP)
- [ ] Theme system (10 starter themes)
- [ ] Media upload (R2)
- [ ] Live preview (mobile frame)
- [ ] Inline text editing

### Phase 3: Invitation Features (Week 9-12)
- [ ] Guest management (import from Excel/CSV)
- [ ] RSVP system + QR codes
- [ ] WhatsApp broadcast
- [ ] Digital envelopes + payment
- [ ] Wishes wall
- [ ] Countdown timer

### Phase 4: Advanced Editor (Week 13-16)
- [ ] AI copywriting
- [ ] Custom CSS editor
- [ ] Animation presets
- [ ] Version history
- [ ] Collaboration (multi-editor)
- [ ] Export (PDF, video)

### Phase 5: Analytics & Optimization (Week 17-20)
- [ ] Real-time analytics dashboard
- [ ] Guest heatmap
- [ ] Performance optimization
- [ ] SEO audit + fixes
- [ ] A/B testing framework

### Phase 6: Scale & Monetize (Week 21-24)
- [ ] Payment integration (Midtrans + Stripe)
- [ ] Subscription management
- [ ] Reseller portal
- [ ] API for partners
- [ ] Multi-language (ID, EN, AR)
- [ ] Mobile app (React Native)

---

## 10. Monetization

### 10.1 Pricing Tiers

| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| **Harga** | Rp0 | Rp49K | Rp149K | Rp499K |
| **Masa Aktif** | 7 hari | 30 hari | 90 hari | 1 tahun |
| **Tema** | 5 | Semua | Semua | Semua + Custom |
| **Tamu** | 50 | 200 | Unlimited | Unlimited |
| **Storage** | 100MB | 1GB | 5GB | 20GB |
| **AI Copywriting** | 3x | 10x | Unlimited | Unlimited |
| **Custom Domain** | ❌ | ✅ | ✅ | ✅ |
| **Watermark** | ✅ | ❌ | ❌ | ❌ |
| **Analytics** | Basic | Full | Full + Export | Full + API |
| **Support** | Community | Email | Priority | Dedicated |
| **Collaboration** | ❌ | ❌ | 2 editors | Unlimited |

### 10.2 Revenue Streams
1. **Subscription** — Monthly/yearly plans
2. **One-time Purchase** — Single invitation payment
3. **Custom Domain Add-on** — Rp25K/domain
4. **Template Marketplace** — 70% to designer, 30% platform
5. **AI Credits** — Pay-per-use for AI features
6. **White Label** — Enterprise solution for wedding organizers
7. **Affiliate** — 20% commission per referral

---

## 11. Competitive Advantages

### vs SatuMomen
| MomenKu | SatuMomen |
|---------|-----------|
| Canva-like visual editor | Basic form editor |
| AI copywriting | Manual input |
| Real-time analytics | Basic RSVP count |
| Edge-first architecture | Traditional server |
| PWA + offline | Web only |
| Multi-channel (WA+Email+SMS+TG) | WhatsApp only |
| Open template marketplace | Closed templates |
| Real-time collaboration | Single user |
| WebGL 3D experiences | Basic animations |
| WCAG 2.1 accessible | Minimal accessibility |

### vs Undangan.in / Others
| MomenKu | Competitors |
|---------|-------------|
| Open-source templates | Proprietary only |
| API-first architecture | No API |
| Multi-language | Indonesia only |
| Self-host option | Cloud only |
| Plugin system | Closed ecosystem |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WhatsApp API changes | High | Multi-channel fallback |
| Payment fraud | Medium | Midtrans fraud detection + manual review |
| Template copyright | High | Original designs + DMCA process |
| DDoS attacks | Medium | Cloudflare protection + rate limiting |
| Data loss | High | Daily backups + point-in-time recovery |
| AI costs | Medium | Caching + credit system + usage caps |
| Competition | High | Speed of execution + unique features |

---

## 13. Success Metrics

### Year 1 Targets
| Metric | Target |
|--------|--------|
| Registered users | 10,000 |
| Paid users | 2,000 |
| Monthly invitations created | 500 |
| MRR | Rp50M (~$3,000) |
| NPS Score | >50 |
| Lighthouse Score | 95+ |
| Uptime | 99.9% |

---

*Document created: 2026-07-16*
*Author: AI Product Manager*
*Status: Draft — Awaiting approval*
