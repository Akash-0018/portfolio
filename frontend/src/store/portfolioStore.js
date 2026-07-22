import { create } from 'zustand'

const usePortfolioStore = create((set) => ({
  activeSection: 0,
  setActiveSection: (index) => set({ activeSection: index }),

  isLoading: true,
  setIsLoading: (val) => set({ isLoading: val }),

  mouseX: 0,
  mouseY: 0,
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),

  hoveredNode: null,
  setHoveredNode: (node) => set({ hoveredNode: node }),

  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  projects: [],
  setProjects: (projects) => set({ projects }),
}))

export default usePortfolioStore
