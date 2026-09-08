import { create } from 'zustand'

const THEME_STORAGE_KEY = 'portfolio_theme'

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

const usePortfolioStore = create((set) => ({
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
  // switch (/projects, /admin) still apply the stored theme.
  theme: readStoredTheme(),
  setTheme: (theme) => {
    persistTheme(theme)
    set({ theme })
  },

  hoveredNode: null,
  setHoveredNode: (node) => set({ hoveredNode: node }),

  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  projects: [],
  setProjects: (projects) => set({ projects }),
}))

export default usePortfolioStore
