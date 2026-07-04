export type SectionType =
  | 'hero'
  | 'couple'
  | 'story'
  | 'gallery'
  | 'events'
  | 'rsvp'
  | 'wishes'
  | 'gifts'
  | 'footer'
  | 'custom'
  | 'countdown'
  | 'maps'
  | 'music'

export type HeroData = {
  title: string
  subtitle: string
  backgroundImage: string
  overlayOpacity: number
}

export type CoupleData = {
  groomName: string
  brideName: string
  groomParents: string
  brideParents: string
  photo: string
}

export type StoryItem = {
  year: string
  title: string
  description: string
  image: string
}

export type StoryData = {
  title: string
  items: StoryItem[]
}

export type GalleryData = {
  title: string
  images: string[]
  columns: 2 | 3 | 4
}

export type EventItem = {
  name: string
  date: string
  time: string
  location: string
  address: string
}

export type EventsData = {
  title: string
  items: EventItem[]
}

export type RsvpData = {
  title: string
  description: string
  fields: string[]
}

export type WishesData = {
  title: string
  showSocialProof: boolean
}

export type GiftItem = {
  name: string
  bank: string
  number: string
  nameAccount: string
}

export type GiftsData = {
  title: string
  items: GiftItem[]
}

export type FooterData = {
  message: string
  coupleNames: string
}

export type CustomData = {
  html: string
  css: string
}

export type CountdownData = {
  title: string
  eventDate: string
}

export type MapsData = {
  title: string
  address: string
  mapsUrl: string
}

export type MusicData = {
  title: string
  musicUrl: string
}

export type SectionDataMap = {
  hero: HeroData
  couple: CoupleData
  story: StoryData
  gallery: GalleryData
  events: EventsData
  rsvp: RsvpData
  wishes: WishesData
  gifts: GiftsData
  footer: FooterData
  custom: CustomData
  countdown: CountdownData
  maps: MapsData
  music: MusicData
}

export type Section<T extends SectionType = SectionType> = {
  id: string
  type: T
  data: SectionDataMap[T]
  visible: boolean
  padding: { top: number; bottom: number; left: number; right: number }
  backgroundColor?: string
  fontFamily?: 'jakarta' | 'cormorant' | 'script'
}

export type Invitation = {
  id: string
  title: string
  slug: string
  date: string
  location: string
  sections: Section[]
  published: boolean
  createdAt: string
  updatedAt: string
}

export const SECTION_CONFIG: Record<
  SectionType,
  { label: string; description: string; icon: string }
> = {
  hero: {
    label: 'Hero',
    description: 'Judul utama dengan gambar latar',
    icon: 'Sparkles',
  },
  couple: {
    label: 'Mempelai',
    description: 'Nama pengantin & orang tua',
    icon: 'Heart',
  },
  story: {
    label: 'Love Story',
    description: 'Perjalanan cinta timeline',
    icon: 'BookHeart',
  },
  gallery: {
    label: 'Galeri Foto',
    description: 'Kolase foto kenangan',
    icon: 'Images',
  },
  events: {
    label: 'Acara',
    description: 'Jadwal & lokasi acara',
    icon: 'Calendar',
  },
  rsvp: {
    label: 'RSVP',
    description: 'Konfirmasi kehadiran',
    icon: 'ClipboardList',
  },
  wishes: {
    label: 'Ucapan',
    description: 'Harapan & doa dari tamu',
    icon: 'MessageCircleHeart',
  },
  gifts: {
    label: 'Hadiah',
    description: 'Info kado & rekening',
    icon: 'Gift',
  },
  footer: {
    label: 'Penutup',
    description: 'Penutup undangan',
    icon: 'PartyPopper',
  },
  custom: {
    label: 'Kustom',
    description: 'HTML/CSS bebas',
    icon: 'Code',
  },
  countdown: {
    label: 'Hitung Mundur',
    description: 'Timer hitung mundur acara',
    icon: 'Clock',
  },
  maps: {
    label: 'Peta',
    description: 'Lokasi acara di peta',
    icon: 'MapPin',
  },
  music: {
    label: 'Musik',
    description: 'Player musik undangan',
    icon: 'Music',
  },
}

export const DEFAULT_SECTION_DATA: {
  [K in SectionType]: SectionDataMap[K]
} = {
  hero: {
    title: 'The Wedding of',
    subtitle: 'Rina & Budi',
    backgroundImage: '',
    overlayOpacity: 0.5,
  },
  couple: {
    groomName: 'Budi Santoso',
    brideName: 'Rina Wulandari',
    groomParents: 'Bpk. Hadi Santoso & Ibu Sari',
    brideParents: 'Bpk. Agus Wulandari & Ibu Dewi',
    photo: '',
  },
  story: {
    title: 'Love Story',
    items: [
      {
        year: '2020',
        title: 'First Meeting',
        description: 'Kami pertama kali bertemu di kantor.',
        image: '',
      },
    ],
  },
  gallery: {
    title: 'Galeri',
    images: [],
    columns: 2,
  },
  events: {
    title: 'Acara',
    items: [
      {
        name: 'Akad Nikah',
        date: '',
        time: '08:00',
        location: 'Masjid Istiqlal',
        address: 'Jl. Taman Wijaya Kusuma, Jakarta',
      },
      {
        name: 'Resepsi',
        date: '',
        time: '11:00 - 14:00',
        location: 'Gedung Serbaguna',
        address: 'Jl. Sudirman No. 123, Jakarta',
      },
    ],
  },
  rsvp: {
    title: 'Konfirmasi Kehadiran',
    description: 'Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.',
    fields: ['name', 'email', 'attendance', 'guests', 'message'],
  },
  wishes: {
    title: 'Ucapan & Doa',
    showSocialProof: true,
  },
  gifts: {
    title: 'Hadiah',
    items: [
      {
        name: 'Bank BCA',
        bank: 'BCA',
        number: '1234567890',
        nameAccount: 'Budi Santoso',
      },
    ],
  },
  footer: {
    message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.',
    coupleNames: 'Rina & Budi',
  },
  custom: {
    html: '<div class="text-center py-8"><p class="text-2xl font-cormorant">Custom Section</p></div>',
    css: '',
  },
  countdown: {
    title: 'Hitung Mundur',
    eventDate: '',
  },
  maps: {
    title: 'Lokasi Acara',
    address: 'Jl. Sudirman No. 123, Jakarta',
    mapsUrl: '',
  },
  music: {
    title: 'Musik Latar',
    musicUrl: '',
  },
}
