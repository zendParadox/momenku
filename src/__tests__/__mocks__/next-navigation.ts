import { vi } from 'vitest'
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
}))
export const usePathname = vi.fn(() => '/')
export const useParams = vi.fn(() => ({}))
