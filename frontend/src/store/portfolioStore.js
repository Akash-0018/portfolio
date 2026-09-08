import { create } from 'zustand'
import { fetchProfile } from '../services/api'

const THEME_STORAGE_KEY = 'portfolio_theme'

export const DEFAULT_PROFILE = {
  photo_url: '/api/uploads/61a1449aa7134424907e483975873ec1.png',
  show_seminar: true,
}

// localStorage throws in some contexts (private mode, blocked site data), and the
// theme must never be the reason the app fails to boot.
const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

const persistTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* non-fatal: the theme simply won't survive a reload */
  }
}

// Module-level so concurrent callers on first paint share a single request
// rather than each firing their own.
let profileRequest = null

const usePortfolioStore = create((set, get) => ({
  activeSection: 0,
  setActiveSection: (index) => set({ activeSection: index }),

  isLoading: true,
  setIsLoading: (val) => set({ isLoading: val }),

  // Written on every mousemove. Read imperatively via getState() inside
  // useFrame - never subscribe to these, or the subscriber re-renders at
  // pointer frequency.
  mouseX: 0,
  mouseY: 0,
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),

  // Owned here rather than inside ThemeSwitch so that routes without the
  // switch still apply the stored theme.
  theme: readStoredTheme(),
  setTheme: (theme) => {
    persistTheme(theme)
    set({ theme })
  },

  // Shared profile settings. Hero, Seminar and the nav all need these; before
  // this they each issued their own GET /api/profile on first paint.
  profile: null,
  loadProfile: async () => {
    const cached = get().profile
    if (cached) return cached

    if (!profileRequest) {
      profileRequest = fetchProfile()
        .then((res) => res.data || DEFAULT_PROFILE)
        .catch(() => DEFAULT_PROFILE)
        .finally(() => {
          profileRequest = null
        })
    }

    const profile = await profileRequest
    set({ profile })
    return profile
  },
  // Used by the admin dashboard so edits are reflected without a reload.
  setProfile: (profile) => set({ profile }),
}))

export default usePortfolioStore
